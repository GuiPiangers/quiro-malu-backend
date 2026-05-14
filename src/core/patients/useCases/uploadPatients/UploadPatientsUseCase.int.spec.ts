import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { KnexAnamnesisRepository } from "../../../../repositories/anamnesis/KnexAnamnesisRepository";
import { KnexDiagnosticRepository } from "../../../../repositories/diagnostic/KnexDiagnosticRepository";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import {
  insertIntegrationUser,
  shouldRunPatientIntegrationSuite,
} from "../../../../test/integration/patientIntegrationHelpers";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { UploadPatientsUseCase } from "./UploadPatientsUseCase";

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  "UploadPatientsUseCase (integration)",
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

    it("importa paciente a partir de CSV válido (nome + telefone)", async () => {
      vi.spyOn(console, "log").mockImplementation(() => {});

      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx);
        const unique = uuidv4().slice(0, 8);
        // CsvStream usa delimiter ";" (ver CsvStream.ts); paciente precisa de nome composto (Patient + Name).
        const buffer = Buffer.from(
          `nome;telefone\nMaria Silva ${unique};(51) 99999 9999\n`,
          "utf8",
        );

        const useCase = new UploadPatientsUseCase(
          new KnexPatientRepository(trx),
          new KnexLocationRepository(trx),
          new KnexAnamnesisRepository(trx),
          new KnexDiagnosticRepository(trx),
        );

        const result = await useCase.execute({ buffer, userId });

        expect(result.fatalError).toBeUndefined();
        expect(result.successCounter).toBeGreaterThanOrEqual(1);

        const row = await trx(ETableNames.PATIENTS)
          .where({ clinicId: userId })
          .where("name", "like", `%${unique}%`)
          .first();
        expect(row).toBeDefined();
      });
    });
  },
);
