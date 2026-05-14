import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from "../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { DeletePatientUseCase } from "./DeletePatientUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "DeletePatientUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("remove o paciente do banco", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Paciente Para Excluir",
          phone: "(51) 96666 5555",
        });

        const useCase = new DeletePatientUseCase(new KnexPatientRepository(trx));
        await useCase.execute(patientId, userId);

        const row = await trx(ETableNames.PATIENTS)
          .where({ id: patientId, clinicId: userId })
          .first();
        expect(row).toBeUndefined();
      });
    });
  },
);
