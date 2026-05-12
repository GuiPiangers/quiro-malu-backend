import type { Knex } from "knex";
import { ETableNames } from "../../../../../database/ETableNames";
import { KnexAnamnesisRepository } from "../../../../../repositories/anamnesis/KnexAnamnesisRepository";
import { createKnexForIntegrationTests } from "../../../../../test/integration/knexTestConnection";
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from "../../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../../test/integration/transactionRollback";
import { GetAnamnesisUseCase } from "./GetAnamnesisUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "GetAnamnesisUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("retorna objeto vazio quando não há anamnese", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Sem Anamnese",
          phone: "(51) 98888 0001",
        });

        const useCase = new GetAnamnesisUseCase(new KnexAnamnesisRepository(trx));
        const data = await useCase.execute(patientId, userId);
        expect(data).toEqual({});
      });
    });

    it("retorna campos persistidos quando existir registro", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Com Anamnese",
          phone: "(51) 98888 0002",
        });
        await trx(ETableNames.ANAMNESIS).insert({
          patientId,
          userId,
          mainProblem: "Dor lombar",
          currentIllness: "Há 2 meses",
        });

        const useCase = new GetAnamnesisUseCase(new KnexAnamnesisRepository(trx));
        const data = await useCase.execute(patientId, userId);

        expect(data.mainProblem).toBe("Dor lombar");
        expect(data.currentIllness).toBe("Há 2 meses");
      });
    });
  },
);
