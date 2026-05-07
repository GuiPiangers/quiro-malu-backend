import { randomUUID } from "node:crypto";
import { Queue, type Job } from "bullmq";
import { DateTime as Luxon } from "luxon";
import { redis } from "../../../../../database/redis";
import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import type {
  BeforeScheduleMessageConfigDTO,
  IBeforeScheduleMessageRepository,
} from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { BeforeScheduleQueue } from "../../../../../queues/beforeScheduleMessage/BeforeScheduleQueue";
import { QueueProvider } from "../../../../../repositories/queueProvider/queueProvider";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import { buildBeforeScheduleMessageJobId } from "../../../utils/buildBeforeScheduleMessageJobId";
import { calculateScheduleMessageDelay } from "../../../utils/calculateScheduleMessageDelay";
import type {
  SendBeforeScheduleMessageJob,
  SendBeforeScheduleMessageUseCase,
} from "../../../useCases/beforeScheduleMessage/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase";
import type { SchedulingDTO } from "../../../../scheduling/models/Scheduling";
import type { BeforeScheduleMessageListenerConfig } from "../beforeScheduleMessageEventHandlers";
import { BeforeScheduleMessageEventHandlers } from "../beforeScheduleMessageEventHandlers";

type CreateScheduleEmitPayload = Omit<SchedulingDTO, "id"> & {
  userId: string;
  scheduleId: string;
};

// ---------------------------------------------------------------------------
// Flags de ambiente
// ---------------------------------------------------------------------------

const runIntegrationTests = ["1", "true", "yes"].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? "").toLowerCase(),
);

const redisEnvReady = Boolean(process.env.DB_REDIS_HOST);

const shouldRunBeforeScheduleQueueIntegration =
  runIntegrationTests && redisEnvReady;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * `AppEventListener.emit` não aguarda listeners `async`; filas BullMQ resolvem
 * em macrotasks. Drena a fila de microtasks + uma macrotask.
 */
async function flushAsyncListeners() {
  await Promise.resolve();
  await new Promise<void>((r) => setImmediate(r));
}

/**
 * Tolerância de delay para CI lento. Pode ser sobrescrita via variável de ambiente.
 */
const SCHEDULE_DELAY_ASSERT_TOLERANCE_MS =
  Number(process.env.SCHEDULE_DELAY_TOLERANCE_MS) || 1500;

function expectJobDelayMatchesSchedule(params: {
  actualDelay: number | undefined;
  scheduleDate: string;
  minutesOffset: number;
}) {
  const expected = calculateScheduleMessageDelay({
    scheduleDate: params.scheduleDate,
    minutesOffset: params.minutesOffset,
    direction: "before",
  });
  expect(params.actualDelay).toBeDefined();
  expect(
    Math.abs((params.actualDelay ?? 0) - expected),
  ).toBeLessThanOrEqual(SCHEDULE_DELAY_ASSERT_TOLERANCE_MS);
}

async function waitForBullJob(
  inspector: Queue<SendBeforeScheduleMessageJob>,
  jobId: string,
): Promise<Job<SendBeforeScheduleMessageJob, any, string>> {
  const job = await vi.waitUntil(
    async () => (await inspector.getJob(jobId)) ?? undefined,
    { timeout: 15_000, interval: 30 },
  );
  if (job == null) {
    throw new Error(`Job "${jobId}" não apareceu na fila`);
  }
  return job;
}

async function waitForBullJobRemoved(
  inspector: Queue<SendBeforeScheduleMessageJob>,
  jobId: string,
) {
  await vi.waitUntil(
    async () => {
      const j = await inspector.getJob(jobId);
      return j == null;
    },
    { timeout: 15_000, interval: 30 },
  );
}

function listenerConfigToDto(
  c: BeforeScheduleMessageListenerConfig,
): BeforeScheduleMessageConfigDTO {
  return {
    id: c.id,
    userId: c.userId,
    name: c.name,
    minutesBeforeSchedule: c.minutesBeforeSchedule,
    textTemplate: "",
    isActive: c.isActive,
  };
}

function createRepoReturningConfigs(
  configs: BeforeScheduleMessageListenerConfig[],
): IBeforeScheduleMessageRepository {
  const byUser = new Map<string, BeforeScheduleMessageListenerConfig[]>();
  for (const c of configs) {
    const arr = byUser.get(c.userId) ?? [];
    arr.push(c);
    byUser.set(c.userId, arr);
  }
  const repo = createMockBeforeScheduleMessageRepository();
  repo.listByUserId.mockImplementation(async ({ userId }) => {
    const list = byUser.get(userId) ?? [];
    return list.map(listenerConfigToDto);
  });
  return repo;
}

/** Monta uma fixture de agendamento com valores-padrão sobrescritíveis. */
function makeSchedulePayload(
  overrides: Partial<CreateScheduleEmitPayload> = {},
): CreateScheduleEmitPayload {
  return {
    userId: "user-default",
    scheduleId: "sched-default",
    patientId: "pat-default",
    date: "2025-01-01T14:00",
    duration: 3600,
    service: "Consulta",
    status: "Agendado",
    reminderSentAt: null,
    ...overrides,
  };
}

/** Monta uma fixture de config com valores-padrão sobrescritíveis. */
function makeConfig(
  overrides: Partial<BeforeScheduleMessageListenerConfig> = {},
): BeforeScheduleMessageListenerConfig {
  return {
    id: randomUUID(),
    userId: "user-default",
    name: "Config padrão",
    minutesBeforeSchedule: 60,
    isActive: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Testes de integração — dependem de Redis real
// ---------------------------------------------------------------------------

describe.skipIf(!shouldRunBeforeScheduleQueueIntegration)(
  "BeforeScheduleMessageEventHandlers (integration, BullMQ)",
  () => {
    let queueName: string;
    let queueProvider: QueueProvider<SendBeforeScheduleMessageJob>;
    let bullInspector: Queue<SendBeforeScheduleMessageJob>;
    let sendStub: SendBeforeScheduleMessageUseCase;
    let beforeScheduleQueue: BeforeScheduleQueue;

    // Recria as dependências de fila a cada teste para evitar estado compartilhado
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["Date"] });
      queueName = `beforeScheduleMessage-int-${randomUUID()}`;
      queueProvider = new QueueProvider<SendBeforeScheduleMessageJob>(queueName);
      bullInspector = new Queue<SendBeforeScheduleMessageJob>(queueName, {
        connection: redis,
      });
      sendStub = {
        execute: vi.fn().mockResolvedValue(undefined),
      } as unknown as SendBeforeScheduleMessageUseCase;
      beforeScheduleQueue = new BeforeScheduleQueue(queueProvider, sendStub);
    });

    afterEach(async () => {
      await bullInspector.obliterate({ force: true });
      await bullInspector.close();
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    // Cria instâncias frescas de handlers + eventListener para cada teste
    function makeHandlers(repo: IBeforeScheduleMessageRepository) {
      const appEventListener = new AppEventListener();
      new BeforeScheduleMessageEventHandlers(
        beforeScheduleQueue,
        appEventListener,
        repo,
      ).register();
      return { appEventListener };
    }

    it("createSchedule cria job na fila com delay alinhado ao agendamento - minutos da config", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-job",
        userId: "user-job",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      const scheduleDate = "2025-01-01T14:00";
      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-job",
        scheduleId: "sched-1",
        patientId: "pat-1",
        date: scheduleDate,
      }));
      await flushAsyncListeners();

      const jobId = buildBeforeScheduleMessageJobId({
        userId: "user-job",
        scheduleId: "sched-1",
        beforeScheduleMessageId: cfg.id,
      });
      const job = await waitForBullJob(bullInspector, jobId);

      expectJobDelayMatchesSchedule({
        actualDelay: job.delay,
        scheduleDate,
        minutesOffset: 60,
      });
      expect(job.data).toEqual({
        userId: "user-job",
        patientId: "pat-1",
        schedulingId: "sched-1",
        beforeScheduleMessageId: cfg.id,
      });
    });

    it("createSchedule não cria job para config inativa", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-inactive",
        userId: "user-inactive",
        isActive: false,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-inactive",
        scheduleId: "sched-inactive",
      }));
      await flushAsyncListeners();

      const jobs = await bullInspector.getDelayed();
      expect(jobs).toHaveLength(0);
    });

    it("createSchedule não cria job quando horário alvo já passou", async () => {
      // Agendamento às 14:00, config de 60min antes = disparo às 13:00
      // Sistema está às 13:30 — delay seria negativo, não deve criar job
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T13:30:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-past",
        userId: "user-past",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-past",
        scheduleId: "sched-past",
        date: "2025-01-01T14:00",
      }));
      await flushAsyncListeners();

      const jobs = await bullInspector.getDelayed();
      expect(jobs).toHaveLength(0);
    });

    it("updateSchedule com novo horário re-upserta o mesmo jobId com novo delay", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-upd-job",
        userId: "user-upd",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      // Cria job para 14:00 — disparo às 13:00 (delay de 3h)
      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-upd",
        scheduleId: "sched-upd",
        patientId: "pat-upd",
        date: "2025-01-01T14:00",
      }));
      await flushAsyncListeners();

      const jobId = buildBeforeScheduleMessageJobId({
        userId: "user-upd",
        scheduleId: "sched-upd",
        beforeScheduleMessageId: cfg.id,
      });
      const jobBefore = await waitForBullJob(bullInspector, jobId);
      const delayBefore = jobBefore.delay ?? 0;

      // Reagenda para 16:00 — disparo às 15:00 (delay de 5h), deve ser maior
      const newDate = "2025-01-01T16:00";
      appEventListener.emit("updateSchedule", makeSchedulePayload({
        userId: "user-upd",
        scheduleId: "sched-upd",
        patientId: "pat-upd",
        date: newDate,
      }));
      await flushAsyncListeners();

      const jobAfter = await waitForBullJob(bullInspector, jobId);
      expect(jobAfter.id).toBe(jobId);
      expect((jobAfter.delay ?? 0) - delayBefore).toBeGreaterThan(0);
      expectJobDelayMatchesSchedule({
        actualDelay: jobAfter.delay,
        scheduleDate: newDate,
        minutesOffset: 60,
      });
    });

    it("updateSchedule remove job quando novo horário alvo já passou", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-upd-past",
        userId: "user-upd-past",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      // Cria job válido para 14:00
      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-upd-past",
        scheduleId: "sched-upd-past",
        patientId: "pat-upd-past",
        date: "2025-01-01T14:00",
      }));
      await flushAsyncListeners();

      const jobId = buildBeforeScheduleMessageJobId({
        userId: "user-upd-past",
        scheduleId: "sched-upd-past",
        beforeScheduleMessageId: cfg.id,
      });
      await waitForBullJob(bullInspector, jobId);

      // Avança o relógio para 13:30 — agendamento atualizado para 14:00
      // com 60min antes = disparo às 13:00, que já passou
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T13:30:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      appEventListener.emit("updateSchedule", makeSchedulePayload({
        userId: "user-upd-past",
        scheduleId: "sched-upd-past",
        date: "2025-01-01T14:00",
      }));
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobId);
    });

    it("deleteSchedule remove o job da fila", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-del",
        userId: "user-del",
        minutesBeforeSchedule: 30,
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-del",
        scheduleId: "sched-del",
        patientId: "pat-del",
      }));
      await flushAsyncListeners();

      const jobId = buildBeforeScheduleMessageJobId({
        userId: "user-del",
        scheduleId: "sched-del",
        beforeScheduleMessageId: cfg.id,
      });
      await waitForBullJob(bullInspector, jobId);

      appEventListener.emit("deleteSchedule", {
        userId: "user-del",
        scheduleId: "sched-del",
      });
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobId);
      expect(await bullInspector.getJob(jobId)).toBeFalsy();
    });

    it("updateSchedule não altera jobs de outro userId", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfgA = makeConfig({
        id: "cfg-iso-upd-a",
        userId: "user-iso-upd-a",
        minutesBeforeSchedule: 60,
      });
      const cfgB = makeConfig({
        id: "cfg-iso-upd-b",
        userId: "user-iso-upd-b",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfgA, cfgB]);
      const { appEventListener } = makeHandlers(repo);

      const scheduleDate = "2025-01-01T14:00";
      appEventListener.emit(
        "createSchedule",
        makeSchedulePayload({
          userId: "user-iso-upd-a",
          scheduleId: "sched-iso-upd",
          patientId: "pat-a",
          date: scheduleDate,
        }),
      );
      appEventListener.emit(
        "createSchedule",
        makeSchedulePayload({
          userId: "user-iso-upd-b",
          scheduleId: "sched-iso-upd",
          patientId: "pat-b",
          date: scheduleDate,
        }),
      );
      await flushAsyncListeners();

      const jobIdA = buildBeforeScheduleMessageJobId({
        userId: "user-iso-upd-a",
        scheduleId: "sched-iso-upd",
        beforeScheduleMessageId: cfgA.id,
      });
      const jobIdB = buildBeforeScheduleMessageJobId({
        userId: "user-iso-upd-b",
        scheduleId: "sched-iso-upd",
        beforeScheduleMessageId: cfgB.id,
      });
      await waitForBullJob(bullInspector, jobIdA);
      const jobBBefore = await waitForBullJob(bullInspector, jobIdB);
      const delayBBefore = jobBBefore.delay ?? 0;

      const newDate = "2025-01-01T16:00";
      appEventListener.emit(
        "updateSchedule",
        makeSchedulePayload({
          userId: "user-iso-upd-a",
          scheduleId: "sched-iso-upd",
          patientId: "pat-a",
          date: newDate,
        }),
      );
      await flushAsyncListeners();

      await waitForBullJob(bullInspector, jobIdA);
      const jobBAfter = await bullInspector.getJob(jobIdB);
      expect(jobBAfter).toBeDefined();
      expect(jobBAfter?.data.userId).toBe("user-iso-upd-b");
      expect(jobBAfter?.delay).toBe(delayBBefore);
    });

    it("deleteSchedule não remove jobs de outro userId", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfgA = makeConfig({
        id: "cfg-iso-del-a",
        userId: "user-iso-del-a",
        minutesBeforeSchedule: 60,
      });
      const cfgB = makeConfig({
        id: "cfg-iso-del-b",
        userId: "user-iso-del-b",
        minutesBeforeSchedule: 60,
      });
      const repo = createRepoReturningConfigs([cfgA, cfgB]);
      const { appEventListener } = makeHandlers(repo);

      const scheduleDate = "2025-01-01T14:00";
      appEventListener.emit(
        "createSchedule",
        makeSchedulePayload({
          userId: "user-iso-del-a",
          scheduleId: "sched-iso-del",
          patientId: "pat-a",
          date: scheduleDate,
        }),
      );
      appEventListener.emit(
        "createSchedule",
        makeSchedulePayload({
          userId: "user-iso-del-b",
          scheduleId: "sched-iso-del",
          patientId: "pat-b",
          date: scheduleDate,
        }),
      );
      await flushAsyncListeners();

      const jobIdA = buildBeforeScheduleMessageJobId({
        userId: "user-iso-del-a",
        scheduleId: "sched-iso-del",
        beforeScheduleMessageId: cfgA.id,
      });
      const jobIdB = buildBeforeScheduleMessageJobId({
        userId: "user-iso-del-b",
        scheduleId: "sched-iso-del",
        beforeScheduleMessageId: cfgB.id,
      });
      await waitForBullJob(bullInspector, jobIdA);
      await waitForBullJob(bullInspector, jobIdB);

      appEventListener.emit("deleteSchedule", {
        userId: "user-iso-del-a",
        scheduleId: "sched-iso-del",
      });
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobIdA);
      expect(await bullInspector.getJob(jobIdA)).toBeFalsy();

      const jobBStill = await bullInspector.getJob(jobIdB);
      expect(jobBStill).toBeDefined();
      expect(jobBStill?.data.userId).toBe("user-iso-del-b");
    });

    it("deleteSchedule remove jobs de configs ativas e inativas", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T10:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfgActive = makeConfig({
        id: "cfg-del-active",
        userId: "user-del-multi",
        minutesBeforeSchedule: 60,
        isActive: true,
      });

      const cfgInactive = makeConfig({
        id: "cfg-del-inactive",
        userId: "user-del-multi",
        minutesBeforeSchedule: 30,
        isActive: false,
      });
      const repo = createRepoReturningConfigs([cfgActive, cfgInactive]);
      const { appEventListener } = makeHandlers(repo);

      // Apenas a config ativa cria job no createSchedule
      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-del-multi",
        scheduleId: "sched-del-multi",
        patientId: "pat-del-multi",
      }));
      await flushAsyncListeners();

      const jobIdActive = buildBeforeScheduleMessageJobId({
        userId: "user-del-multi",
        scheduleId: "sched-del-multi",
        beforeScheduleMessageId: cfgActive.id,
      });
      await waitForBullJob(bullInspector, jobIdActive);

      // deleteSchedule deve tentar remover ambos (ativas e inativas)
      appEventListener.emit("deleteSchedule", {
        userId: "user-del-multi",
        scheduleId: "sched-del-multi",
      });
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobIdActive);
    });
  },
);