import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../../database/ETableNames";
import { BlockScheduleRepository } from "../../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { createKnexForIntegrationTests } from "../../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../../test/integration/transactionRollback";
import { EditBlockScheduleUseCase } from "./editBlockScheduleUseCase";

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

describe.skipIf(!shouldRunIntegrationSuite)(
  "EditBlockScheduleUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("atualiza descrição e horários no banco", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx);
        const blockId = uuidv4();
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId,
          startDate: "2038-03-01T09:00:00",
          endDate: "2038-03-01T10:00:00",
          description: "Antigo",
        });

        const useCase = new EditBlockScheduleUseCase(
          new BlockScheduleRepository(trx),
          new KnexSchedulingRepository(trx),
        );

        await useCase.execute(
          {
            id: blockId,
            date: "2038-03-01T09:30",
            endDate: "2038-03-01T11:00",
            description: "Novo texto",
          },
          userId,
          userId,
        );

        const row = await trx(ETableNames.BLOCK_SCHEDULES)
          .where({ id: blockId, userId })
          .first();

        expect(row?.description).toBe("Novo texto");
      });
    });

    it("retorna erro quando o bloqueio não existe para o usuário", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx);
        const useCase = new EditBlockScheduleUseCase(
          new BlockScheduleRepository(trx),
          new KnexSchedulingRepository(trx),
        );

        await expect(
          useCase.execute(
            { id: uuidv4(), description: "X" },
            userId,
            userId,
          ),
        ).rejects.toMatchObject({ message: "Agendamento não encontrado" });
      });
    });

    it("rejeita edição que sobrepõe agendamento existente", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const blockId = uuidv4();
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId,
          startDate: "2038-03-05T08:00:00",
          endDate: "2038-03-05T09:00:00",
          description: "Bloco",
        });

        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId,
          clinicId: userId,
          patientId,
          date: "2038-03-05T10:30:00",
          duration: 3600,
          status: "Agendado",
          service: "Sessão",
        });

        const useCase = new EditBlockScheduleUseCase(
          new BlockScheduleRepository(trx),
          new KnexSchedulingRepository(trx),
        );

        await expect(
          useCase.execute(
            {
              id: blockId,
              date: "2038-03-05T10:00",
              endDate: "2038-03-05T11:30",
            },
            userId,
            userId,
          ),
        ).rejects.toThrow(/indisponível/);

        const row = await trx(ETableNames.BLOCK_SCHEDULES)
          .where({ id: blockId, userId })
          .first();
        expect(row?.description).toBe("Bloco");
      });
    });
  },
);
