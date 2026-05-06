import type { Knex } from "knex";
import { ETableNames } from "../../../../../database/ETableNames";
import { KnexDiagnosticRepository } from "../../../../../repositories/diagnostic/KnexDiagnosticRepository";
import { createKnexForIntegrationTests } from "../../../../../test/integration/knexTestConnection";
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from "../../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../../test/integration/transactionRollback";
import { GetDiagnosticUseCase } from "./GetDiagnosticUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "GetDiagnosticUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it("retorna objeto vazio quando não há diagnóstico", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Sem Diagnóstico",
          phone: "(51) 96666 0001",
        });

        const useCase = new GetDiagnosticUseCase(
          new KnexDiagnosticRepository(trx),
        );
        const data = await useCase.execute(patientId, userId);
        expect(data).toEqual({});
      });
    });

    it("retorna diagnóstico persistido", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: "Com Diagnóstico",
          phone: "(51) 96666 0002",
        });
        await trx(ETableNames.DIAGNOSTICS).insert({
          patientId,
          userId,
          diagnostic: "Escoliose",
          treatmentPlan: "Pilates",
        });

        const useCase = new GetDiagnosticUseCase(
          new KnexDiagnosticRepository(trx),
        );
        const data = await useCase.execute(patientId, userId);

        expect(data.diagnostic).toBe("Escoliose");
        expect(data.treatmentPlan).toBe("Pilates");
      });
    });
  },
);
