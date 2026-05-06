import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import {
  expectedLocationDisplayField,
  expectedPatientDisplayName,
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from "../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { UpdatePatientUseCase } from "./UpdatePatientUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "UpdatePatientUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("atualiza dados do paciente e grava localização quando não existia", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Carlos Antigo",
          phone: "(51) 97777 6666",
        });

        const useCase = new UpdatePatientUseCase(
          new KnexPatientRepository(trx),
          new KnexLocationRepository(trx),
        );

        const newName = "Carlos Novo";
        const newAddress = "Av. Brasil 200";
        await useCase.execute(
          {
            id: patientId,
            name: newName,
            phone: "(51) 97777 6666",
            location: {
              address: newAddress,
              city: "Canoas",
              state: "Rio Grande do Sul",
            },
          },
          userId,
        );

        const row = await trx(ETableNames.PATIENTS)
          .where({ id: patientId, userId })
          .first();
        expect(row?.name).toBe(expectedPatientDisplayName(newName));

        const loc = await trx(ETableNames.LOCATIONS)
          .where({ patientId, userId })
          .first();
        expect(loc?.address).toBe(expectedLocationDisplayField(newAddress));
      });
    });
  },
);
