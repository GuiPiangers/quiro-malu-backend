import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../../database/ETableNames";
import { KnexProgressRepository } from "../../../../../repositories/progress/KnexProgressRepository";
import { createKnexForIntegrationTests } from "../../../../../test/integration/knexTestConnection";
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from "../../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../../test/integration/transactionRollback";
import { DeleteProgressUseCase } from "./DeleteProgressUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "DeleteProgressUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("remove evolução do banco", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Delete Progress",
          phone: "(51) 91111 0001",
        });
        const progressId = uuidv4();
        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          patientId,
          userId,
          clinicId: userId,
          service: "Remover",
          date: "2038-05-01 09:00:00",
        });

        const useCase = new DeleteProgressUseCase(
          new KnexProgressRepository(trx),
        );
        await useCase.execute({ id: progressId, patientId, userId });

        const row = await trx(ETableNames.PROGRESS)
          .where({ id: progressId, patientId, clinicId: userId })
          .first();
        expect(row).toBeUndefined();
      });
    });
  },
);
