import { v4 as uuidv4 } from "uuid";
import { ETableNames } from "../../../../database/ETableNames";
import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { appEventListener } from "../../../shared/observers/EventListener";
import { DateTime } from "../../../shared/Date";
import { BlockSchedule } from "../../models/BlockSchedule";
import { CreateSchedulingUseCase } from "./CreateSchedulingUseCase";
import type { Knex } from "knex";

const integrationEnvReady = Boolean(
  process.env.DB_HOST &&
    process.env.MYSQL_ROOT_USER &&
    process.env.MYSQL_DATABASE,
);

const runIntegrationTests = ["1", "true", "yes"].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? "").toLowerCase(),
);

const shouldRunIntegrationSuite = integrationEnvReady && runIntegrationTests;

async function insertUserAndPatient(trx: Knex.Transaction) {
  const userId = uuidv4();
  const patientId = uuidv4();
  await trx(ETableNames.USERS).insert({
    id: userId,
    name: "Integration user",
    email: `${userId}@integration.test`,
    password: "not-used",
  });
  await trx(ETableNames.PATIENTS).insert({
    id: patientId,
    name: "Integration patient",
    userId,
  });
  return { userId, patientId };
}

describe.skipIf(!shouldRunIntegrationSuite)(
  "CreateSchedulingUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    afterEach(() => {
      appEventListener.clearAllListeners();
      vi.restoreAllMocks();
    });

    it("persiste o agendamento no banco (consulta na mesma transação)", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const schedulingId = uuidv4();
        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new BlockScheduleRepository(trx),
        );

        await useCase.execute({
          userId,
          patientId,
          id: schedulingId,
          date: "2030-06-15T10:00",
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
        });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: schedulingId, userId })
          .first();

        expect(row).toBeDefined();
        expect(row.patientId).toBe(patientId);
        expect(row.service).toBe("Quiropraxia");
        expect(row.status).toBe("Agendado");
        expect(row.duration).toBe(3600);
      });
    });

    it("rejeita sobreposição com agendamento em status que bloqueia o horário", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const existingId = uuidv4();
        await trx(ETableNames.SCHEDULES).insert({
          id: existingId,
          userId,
          patientId,
          date: "2030-06-15T10:30:00",
          duration: 3600,
          service: "Quiropraxia",
          status: "Agendado",
        });

        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new BlockScheduleRepository(trx),
        );

        await expect(
          useCase.execute({
            userId,
            patientId,
            id: uuidv4(),
            date: "2030-06-15T10:00",
            duration: 3600,
            status: "Agendado",
            service: "Quiropraxia",
          }),
        ).rejects.toMatchObject({
          message: "Horário indisponível",
        });

        const count = await trx(ETableNames.SCHEDULES)
          .where({ userId })
          .count("id as c")
          .first();
        expect(Number((count as { c: number | string }).c)).toBe(1);
      });
    });

    it("permite sobreposição quando o agendamento existente está Atendido", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId,
          patientId,
          date: "2030-06-15T10:30:00",
          duration: 3600,
          service: "Quiropraxia",
          status: "Atendido",
        });

        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new BlockScheduleRepository(trx),
        );

        const newId = uuidv4();
        await useCase.execute({
          userId,
          patientId,
          id: newId,
          date: "2030-06-15T10:00",
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
        });

        const rows = await trx(ETableNames.SCHEDULES).where({ userId });
        expect(rows).toHaveLength(2);
      });
    });

    it("permite sobreposição quando o agendamento existente está Cancelado", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId,
          patientId,
          date: "2030-06-15T10:30:00",
          duration: 3600,
          service: "Quiropraxia",
          status: "Cancelado",
        });

        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new BlockScheduleRepository(trx),
        );

        await useCase.execute({
          userId,
          patientId,
          id: uuidv4(),
          date: "2030-06-15T10:00",
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
        });

        const rows = await trx(ETableNames.SCHEDULES).where({ userId });
        expect(rows).toHaveLength(2);
      });
    });

    it("rejeita horário coberto por evento (bloqueio)", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const blockRepo = new BlockScheduleRepository(trx);
        const block = new BlockSchedule({
          id: uuidv4(),
          date: new DateTime("2030-06-15T08:00"),
          endDate: new DateTime("2030-06-15T18:00"),
          description: "Evento teste",
        });
        await blockRepo.save(block, userId);

        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          blockRepo,
        );

        await expect(
          useCase.execute({
            userId,
            patientId,
            id: uuidv4(),
            date: "2030-06-15T10:00",
            duration: 3600,
            status: "Agendado",
            service: "Quiropraxia",
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError);
          expect((err as ApiError).message).toMatch(/bloqueado por um evento/);
          return true;
        });
      });
    });

    it("emite createSchedule no appEventListener e executa listeners registrados", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const listener = vi.fn().mockResolvedValue(undefined);
        appEventListener.on("createSchedule", listener);
        const emitSpy = vi.spyOn(appEventListener, "emit");

        const schedulingId = uuidv4();
        const useCase = new CreateSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new BlockScheduleRepository(trx),
        );

        await useCase.execute({
          userId,
          patientId,
          id: schedulingId,
          date: "2030-06-20T11:00",
          duration: 1800,
          status: "Agendado",
          service: "Avaliação",
        });

        expect(emitSpy).toHaveBeenCalledWith(
          "createSchedule",
          expect.objectContaining({
            userId,
            patientId,
            scheduleId: schedulingId,
            service: "Avaliação",
          }),
        );
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(
          expect.objectContaining({
            userId,
            patientId,
            scheduleId: schedulingId,
          }),
        );
      });
    });
  },
);
