import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { AppEventListener } from "../../../shared/observers/EventListener";
import { DeleteSchedulingUseCase } from "./DeleteSchedulingUseCase";

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

async function insertSchedule(
  trx: Knex.Transaction,
  row: {
    id: string;
    userId: string;
    patientId: string;
    date: string;
    duration: number;
    status: string;
    service: string;
  },
) {
  await trx(ETableNames.SCHEDULES).insert({
    id: row.id,
    userId: row.userId,
    patientId: row.patientId,
    date: row.date,
    duration: row.duration,
    status: row.status,
    service: row.service,
  });
}

describe.skipIf(!shouldRunIntegrationSuite)(
  "DeleteSchedulingUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("remove o agendamento do banco quando id e userId conferem", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const scheduleId = uuidv4();

        await insertSchedule(trx, {
          id: scheduleId,
          userId,
          patientId,
          date: "2030-04-01T10:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Consulta",
        });

        const useCase = new DeleteSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new AppEventListener(),
        );

        await useCase.execute({ id: scheduleId, userId });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: scheduleId, userId })
          .first();

        expect(row).toBeUndefined();
      });
    });

    it("não remove agendamento de outro usuário", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const owner = await insertUserAndPatient(trx);
        const other = await insertUserAndPatient(trx);
        const scheduleId = uuidv4();

        await insertSchedule(trx, {
          id: scheduleId,
          userId: owner.userId,
          patientId: owner.patientId,
          date: "2030-04-02T11:00:00",
          duration: 3600,
          status: "Agendado",
          service: "A",
        });

        const useCase = new DeleteSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          new AppEventListener(),
        );

        await useCase.execute({ id: scheduleId, userId: other.userId });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: scheduleId, userId: owner.userId })
          .first();

        expect(row).toBeDefined();
        expect(row?.service).toBe("A");
      });
    });

    it("emite deleteSchedule no appEventListener e executa listeners", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const scheduleId = uuidv4();

        await insertSchedule(trx, {
          id: scheduleId,
          userId,
          patientId,
          date: "2030-04-03T12:00:00",
          duration: 1800,
          status: "Agendado",
          service: "Sessão",
        });

        const events = new AppEventListener();
        const listener = vi.fn().mockResolvedValue(undefined);
        events.on("deleteSchedule", listener);
        const emitSpy = vi.spyOn(events, "emit");

        const useCase = new DeleteSchedulingUseCase(
          new KnexSchedulingRepository(trx),
          events,
        );

        await useCase.execute({ id: scheduleId, userId });

        expect(emitSpy).toHaveBeenCalledWith("deleteSchedule", {
          scheduleId,
          userId,
        });
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({
          scheduleId,
          userId,
        });
      });
    });
  },
);
