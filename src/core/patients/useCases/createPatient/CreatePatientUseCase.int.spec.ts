import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import {
  expectedLocationDisplayField,
  expectedPatientDisplayName,
  insertIntegrationUser,
  shouldRunPatientIntegrationSuite,
} from "../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { CreatePatientUseCase } from "./CreatePatientUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "CreatePatientUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("persiste paciente e endereço na mesma transação", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const useCase = new CreatePatientUseCase(
          new KnexPatientRepository(trx),
          new KnexLocationRepository(trx),
        );

        const patientName = "Maria Paciente";
        const street = "Rua das Flores 100";
        const created = await useCase.execute(
          {
            name: patientName,
            phone: "(51) 98888 7777",
            cpf: "036.638.400-00",
            location: {
              address: street,
              city: "Porto Alegre",
              state: "Rio Grande do Sul",
            },
          },
          userId,
        );

        const row = await trx(ETableNames.PATIENTS)
          .where({ id: created.id, clinicId: userId })
          .first();
        expect(row?.name).toBe(expectedPatientDisplayName(patientName));

        const loc = await trx(ETableNames.LOCATIONS)
          .where({ patientId: created.id, clinicId: userId })
          .first();
        expect(loc?.address).toBe(expectedLocationDisplayField(street));
      });
    });
  },
);
