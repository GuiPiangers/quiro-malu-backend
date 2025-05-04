import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";

export class KnexDiagnosticRepository implements IDiagnosticRepository {
  async save(
    { patientId, ...data }: DiagnosticDTO,
    userId: string,
  ): Promise<void> {
    return await Knex(ETableNames.DIAGNOSTICS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async saveMany(data: (DiagnosticDTO & { userId: string })[]): Promise<void> {
    await Knex(ETableNames.DIAGNOSTICS).insert(data);
  }

  async update(
    { patientId, ...data }: DiagnosticDTO,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.DIAGNOSTICS)
      .update(data)
      .where({ patientId, userId });
  }

  async get(patientId: string, userId: string): Promise<DiagnosticDTO> {
    const result = await Knex(ETableNames.DIAGNOSTICS)
      .first("*")
      .where({ patientId, userId });

    return result;
  }
}
