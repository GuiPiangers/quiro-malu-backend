import { randomUUID } from "node:crypto";
import { Queue, type Job } from "bullmq";
import { DateTime as Luxon } from "luxon";
import { redis } from "../../../../../database/redis";
import { createMockAfterScheduleMessageRepository } from "../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import type {
  AfterScheduleMessageConfigDTO,
  IAfterScheduleMessageRepository,
} from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { AfterScheduleQueue } from "../../../../../queues/afterScheduleMessage/AfterScheduleQueue";
import { QueueProvider } from "../../../../../repositories/queueProvider/queueProvider";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import { buildAfterScheduleMessageJobId } from "../../../utils/buildAfterScheduleMessageJobId";
import { calculateScheduleMessageDelay } from "../../../utils/calculateScheduleMessageDelay";
import type {
  SendAfterScheduleMessageJob,
  SendAfterScheduleMessageUseCase,
} from "../../../useCases/afterScheduleMessage/sendAfterScheduleMessage/sendAfterScheduleMessageUseCase";
import type { SchedulingDTO } from "../../../../scheduling/models/Scheduling";
import type { AfterScheduleMessageListenerConfig } from "../afterScheduleMessageEventHandlers";
import { AfterScheduleMessageEventHandlers } from "../afterScheduleMessageEventHandlers";

type CreateScheduleEmitPayload = Omit<SchedulingDTO, "id"> & {
  userId: string;
  clinicId: string;
  scheduleId: string;
};

// ---------------------------------------------------------------------------
// Flags de ambiente
// ---------------------------------------------------------------------------

const runIntegrationTests = ["1", "true", "yes"].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? "").toLowerCase(),
);

const redisEnvReady = Boolean(process.env.DB_REDIS_HOST);

const shouldRunAfterScheduleQueueIntegration =
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
 * O delay gravado no BullMQ usa `DateTime.now()` no momento do `upsert`.
 * No assert já passou algum tempo (p.ex. polling do `waitUntil`).
 * Compara com a mesma fórmula do domínio, com folga generosa para CI lento.
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
    direction: "after",
  });
  expect(params.actualDelay).toBeDefined();
  expect(
    Math.abs((params.actualDelay ?? 0) - expected),
  ).toBeLessThanOrEqual(SCHEDULE_DELAY_ASSERT_TOLERANCE_MS);
}

async function waitForBullJob(
  inspector: Queue<SendAfterScheduleMessageJob>,
  jobId: string,
): Promise<Job<SendAfterScheduleMessageJob, any, string>> {
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
  inspector: Queue<SendAfterScheduleMessageJob>,
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
  c: AfterScheduleMessageListenerConfig,
): AfterScheduleMessageConfigDTO {
  return {
    id: c.id,
    userId: c.userId,
    name: c.name,
    minutesAfterSchedule: c.minutesAfterSchedule,
    textTemplate: "",
    isActive: c.isActive,
  };
}

/** `listByUserId` devolve as configs agrupadas por `userId` (como no repositório real). */
function createRepoReturningConfigs(
  configs: AfterScheduleMessageListenerConfig[],
): IAfterScheduleMessageRepository {
  const byUser = new Map<string, AfterScheduleMessageListenerConfig[]>();
  for (const c of configs) {
    const arr = byUser.get(c.userId) ?? [];
    arr.push(c);
    byUser.set(c.userId, arr);
  }
  const repo = createMockAfterScheduleMessageRepository();
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
    clinicId: "clinic-default",
    scheduleId: "sched-default",
    patientId: "pat-default",
    date: "2025-01-01T14:00",
    duration: 3600,
    service: "Consulta",
    status: "Atendido",
    reminderSentAt: null,
    ...overrides,
  };
}

/** Monta uma fixture de config com valores-padrão sobrescritíveis. */
function makeConfig(
  overrides: Partial<AfterScheduleMessageListenerConfig> = {},
): AfterScheduleMessageListenerConfig {
  return {
    id: randomUUID(),
    userId: "user-default",
    name: "Config padrão",
    minutesAfterSchedule: 60,
    isActive: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Testes de integração — dependem de Redis real
// ---------------------------------------------------------------------------

describe.skipIf(!shouldRunAfterScheduleQueueIntegration)(
  "AfterScheduleMessageEventHandlers (integration, BullMQ)",
  () => {
    let queueName: string;
    let queueProvider: QueueProvider<SendAfterScheduleMessageJob>;
    let bullInspector: Queue<SendAfterScheduleMessageJob>;
    let sendStub: SendAfterScheduleMessageUseCase;
    let afterScheduleQueue: AfterScheduleQueue;

    // Recria as dependências de fila a cada teste para evitar estado compartilhado
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["Date"] });
      queueName = `afterScheduleMessage-int-${randomUUID()}`;
      queueProvider = new QueueProvider<SendAfterScheduleMessageJob>(queueName);
      bullInspector = new Queue<SendAfterScheduleMessageJob>(queueName, {
        connection: redis,
      });
      sendStub = {
        execute: vi.fn().mockResolvedValue(undefined),
      } as unknown as SendAfterScheduleMessageUseCase;
      afterScheduleQueue = new AfterScheduleQueue(queueProvider, sendStub);
    });

    afterEach(async () => {
      await bullInspector.obliterate({ force: true });
      await bullInspector.close();
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    // Cria instâncias frescas de handlers + eventListener para cada teste
    function makeHandlers(repo: IAfterScheduleMessageRepository) {
      const appEventListener = new AppEventListener();
      new AfterScheduleMessageEventHandlers(
        afterScheduleQueue,
        appEventListener,
        repo,
      ).register();
      return { appEventListener };
    }

    it("createSchedule cria job na fila com delay alinhado ao agendamento + minutos da config", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({ id: "cfg-job", userId: "user-job", minutesAfterSchedule: 60 });
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

      const jobId = buildAfterScheduleMessageJobId({
        userId: "user-job",
        scheduleId: "sched-1",
        afterScheduleMessageId: cfg.id,
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
        afterScheduleMessageId: cfg.id,
      });
    });

    it("createSchedule não cria job para config inativa", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({
        id: "cfg-inactive",
        userId: "user-inactive",
        isActive: false, // inativa — não deve gerar job
      });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-inactive",
        scheduleId: "sched-inactive",
        patientId: "pat-inactive",
      }));
      await flushAsyncListeners();

      const jobs = await bullInspector.getDelayed();
      expect(jobs).toHaveLength(0);
    });

    it("createSchedule não cria job quando status não é Atendido", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({ id: "cfg-status", userId: "user-status" });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-status",
        scheduleId: "sched-status",
        status: "Agendado", // não é Atendido
      }));
      await flushAsyncListeners();

      const jobs = await bullInspector.getDelayed();
      expect(jobs).toHaveLength(0);
    });

    it("updateSchedule remove job existente quando status muda para não-Atendido", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({ id: "cfg-status-upd", userId: "user-status-upd" });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      // Cria o job com status Atendido
      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-status-upd",
        scheduleId: "sched-status-upd",
        status: "Atendido",
      }));
      await flushAsyncListeners();

      const jobId = buildAfterScheduleMessageJobId({
        userId: "user-status-upd",
        scheduleId: "sched-status-upd",
        afterScheduleMessageId: cfg.id,
      });
      await waitForBullJob(bullInspector, jobId);

      // Atualiza para status não-Atendido — job deve ser removido
      appEventListener.emit("updateSchedule", makeSchedulePayload({
        userId: "user-status-upd",
        scheduleId: "sched-status-upd",
        status: "Cancelado",
      }));
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobId);
    });

    it("updateSchedule com novo horário re-upserta o mesmo jobId com novo delay", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({ id: "cfg-upd-job", userId: "user-upd", minutesAfterSchedule: 60 });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-upd",
        scheduleId: "sched-upd",
        patientId: "pat-upd",
        date: "2025-01-01T14:00",
      }));
      await flushAsyncListeners();

      const jobId = buildAfterScheduleMessageJobId({
        userId: "user-upd",
        scheduleId: "sched-upd",
        afterScheduleMessageId: cfg.id,
      });
      const jobBefore = await waitForBullJob(bullInspector, jobId);
      const delayBefore = jobBefore.delay ?? 0;

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

    it("updateSchedule não altera jobs de outro userId", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfgA = makeConfig({
        id: "cfg-iso-upd-a",
        userId: "user-iso-upd-a",
        minutesAfterSchedule: 60,
      });
      const cfgB = makeConfig({
        id: "cfg-iso-upd-b",
        userId: "user-iso-upd-b",
        minutesAfterSchedule: 60,
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

      const jobIdA = buildAfterScheduleMessageJobId({
        userId: "user-iso-upd-a",
        scheduleId: "sched-iso-upd",
        afterScheduleMessageId: cfgA.id,
      });
      const jobIdB = buildAfterScheduleMessageJobId({
        userId: "user-iso-upd-b",
        scheduleId: "sched-iso-upd",
        afterScheduleMessageId: cfgB.id,
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

    it("deleteSchedule remove o job da fila", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfg = makeConfig({ id: "cfg-del", userId: "user-del", minutesAfterSchedule: 30 });
      const repo = createRepoReturningConfigs([cfg]);
      const { appEventListener } = makeHandlers(repo);

      appEventListener.emit("createSchedule", makeSchedulePayload({
        userId: "user-del",
        scheduleId: "sched-del",
        patientId: "pat-del",
      }));
      await flushAsyncListeners();

      const jobId = buildAfterScheduleMessageJobId({
        userId: "user-del",
        scheduleId: "sched-del",
        afterScheduleMessageId: cfg.id,
      });
      await waitForBullJob(bullInspector, jobId);

      appEventListener.emit("deleteSchedule", {
        clinicId: "clinic-int",
          userId: "user-del",
        scheduleId: "sched-del",
      });
      await flushAsyncListeners();

      await waitForBullJobRemoved(bullInspector, jobId);
      expect(await bullInspector.getJob(jobId)).toBeFalsy();
    });

    it("deleteSchedule não remove jobs de outro userId", async () => {
      vi.setSystemTime(
        Luxon.fromISO("2025-01-01T12:00:00", { zone: "America/Sao_Paulo" }).toMillis(),
      );

      const cfgA = makeConfig({
        id: "cfg-iso-del-a",
        userId: "user-iso-del-a",
        minutesAfterSchedule: 60,
      });
      const cfgB = makeConfig({
        id: "cfg-iso-del-b",
        userId: "user-iso-del-b",
        minutesAfterSchedule: 60,
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

      const jobIdA = buildAfterScheduleMessageJobId({
        userId: "user-iso-del-a",
        scheduleId: "sched-iso-del",
        afterScheduleMessageId: cfgA.id,
      });
      const jobIdB = buildAfterScheduleMessageJobId({
        userId: "user-iso-del-b",
        scheduleId: "sched-iso-del",
        afterScheduleMessageId: cfgB.id,
      });
      await waitForBullJob(bullInspector, jobIdA);
      await waitForBullJob(bullInspector, jobIdB);

      appEventListener.emit("deleteSchedule", {
        clinicId: "clinic-int",
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
  },
);