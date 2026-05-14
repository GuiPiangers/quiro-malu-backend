import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { ListSchedulingUseCase } from "./ListSchedulingUseCase";

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
  await trx(ETableNames.CLINICS).insert({
    id: userId,
    name: `Clinic ${userId}`,
  });
  await trx(ETableNames.USERS).insert({
    id: userId,
    clinicId: userId,
    name: "Integration user",
    email: `${userId}@integration.test`,
    password: "not-used",
  });
  await trx(ETableNames.PATIENTS).insert({
    id: patientId,
    name: "Integration patient",
    userId,
    clinicId: userId,
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
    clinicId: row.userId,
    patientId: row.patientId,
    date: row.date,
    duration: row.duration,
    status: row.status,
    service: row.service,
  });
}

describe.skipIf(!shouldRunIntegrationSuite)(
  "ListSchedulingUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("retorna apenas agendamentos do dia informado (YYYY-MM-DD)", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const idSameDayA = uuidv4();
        const idSameDayB = uuidv4();
        const idOtherDay = uuidv4();

        await insertSchedule(trx, {
          id: idSameDayA,
          userId,
          patientId,
          date: "2030-11-15T09:15:00",
          duration: 3600,
          status: "Agendado",
          service: "Manhã",
        });
        await insertSchedule(trx, {
          id: idSameDayB,
          userId,
          patientId,
          date: "2030-11-15T16:45:00",
          duration: 1800,
          status: "Agendado",
          service: "Tarde",
        });
        await insertSchedule(trx, {
          id: idOtherDay,
          userId,
          patientId,
          date: "2030-11-16T10:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Outro dia",
        });

        const useCase = new ListSchedulingUseCase(
          new KnexSchedulingRepository(trx),
        );

        const result = await useCase.execute({
          userId,
          date: "2030-11-15",
        });

        expect(result.total).toBe(2);
        expect(result.schedules).toHaveLength(2);

        const ids = result.schedules.map((s) => s.id).sort();
        expect(ids).toEqual([idSameDayA, idSameDayB].sort());

        for (const s of result.schedules) {
          expect(s.date).toMatch(/^2030-11-15T\d{2}:\d{2}$/);
          expect(typeof s.date).toBe("string");
        }
      });
    });

    it("não retorna agendamentos de outros usuários nem de outras datas", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const a = await insertUserAndPatient(trx);
        const b = await insertUserAndPatient(trx);

        const idOwner = uuidv4();
        const idStrangerSameDate = uuidv4();

        await insertSchedule(trx, {
          id: idOwner,
          userId: a.userId,
          patientId: a.patientId,
          date: "2030-12-01T11:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Dono",
        });
        await insertSchedule(trx, {
          id: idStrangerSameDate,
          userId: b.userId,
          patientId: b.patientId,
          date: "2030-12-01T14:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Outro user",
        });

        const useCase = new ListSchedulingUseCase(
          new KnexSchedulingRepository(trx),
        );

        const result = await useCase.execute({
          userId: a.userId,
          date: "2030-12-01",
        });

        expect(result.total).toBe(1);
        expect(result.schedules).toHaveLength(1);
        expect(result.schedules[0]?.id).toBe(idOwner);
        expect(result.schedules[0]?.date).toBe("2030-12-01T11:00");
      });
    });

    it("retorna lista vazia e total zero quando não há agendamentos na data", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        await insertSchedule(trx, {
          id: uuidv4(),
          userId,
          patientId,
          date: "2030-08-01T10:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Só outro dia",
        });

        const useCase = new ListSchedulingUseCase(
          new KnexSchedulingRepository(trx),
        );

        const result = await useCase.execute({
          userId,
          date: "2030-08-02",
        });

        expect(result.total).toBe(0);
        expect(result.schedules).toEqual([]);
      });
    });
  },
);
