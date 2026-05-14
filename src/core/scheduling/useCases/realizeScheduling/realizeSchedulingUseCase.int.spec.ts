import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexProgressRepository } from "../../../../repositories/progress/KnexProgressRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { RealizeSchedulingUseCase } from "./realizeSchedulingUseCase";

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

function createRealizeSchedulingUseCase(trx: Knex.Transaction) {
  return new RealizeSchedulingUseCase(
    new KnexSchedulingRepository(trx),
    new KnexProgressRepository(trx),
  );
}

describe.skipIf(!shouldRunIntegrationSuite)(
  "RealizeSchedulingUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("atualiza o agendamento para Atendido quando existe evolução vinculada ao scheduling", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const schedulingId = uuidv4();
        const progressId = uuidv4();

        await trx(ETableNames.SCHEDULES).insert({
          id: schedulingId,
          userId,
          clinicId: userId,
          patientId,
          date: "2030-05-10T09:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Consulta",
        });

        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          userId,
          clinicId: userId,
          patientId,
          service: "Consulta",
          schedulingId,
          date: "2030-05-10T09:30:00",
          actualProblem: "Teste",
          procedures: "Procedimento",
        });

        const useCase = createRealizeSchedulingUseCase(trx);

        await useCase.execute({
          userId,
          patientId,
          schedulingId,
        });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: schedulingId, userId })
          .first();

        expect(row?.status).toBe("Atendido");
      });
    });

    it("rejeita quando não há evolução associada ao agendamento", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const schedulingId = uuidv4();

        await trx(ETableNames.SCHEDULES).insert({
          id: schedulingId,
          userId,
          clinicId: userId,
          patientId,
          date: "2030-05-11T10:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Consulta",
        });

        const useCase = createRealizeSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            patientId,
            schedulingId,
          }),
        ).rejects.toMatchObject({
          message: "A evolução deve ser salva para poder realizar a consulta",
          statusCode: 424,
        });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: schedulingId, userId })
          .first();

        expect(row?.status).toBe("Agendado");
      });
    });

    it("rejeita quando a evolução existe mas para outro patientId", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const otherPatientId = uuidv4();
        await trx(ETableNames.PATIENTS).insert({
          id: otherPatientId,
          name: "Outro paciente",
          userId,
          clinicId: userId,
        });

        const schedulingId = uuidv4();
        const progressId = uuidv4();

        await trx(ETableNames.SCHEDULES).insert({
          id: schedulingId,
          userId,
          clinicId: userId,
          patientId,
          date: "2030-05-12T11:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Consulta",
        });

        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          userId,
          clinicId: userId,
          patientId: otherPatientId,
          service: "Consulta",
          schedulingId,
          date: "2030-05-12T11:30:00",
        });

        const useCase = createRealizeSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            patientId,
            schedulingId,
          }),
        ).rejects.toBeInstanceOf(ApiError);

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: schedulingId, userId })
          .first();

        expect(row?.status).toBe("Agendado");
      });
    });
  },
);
