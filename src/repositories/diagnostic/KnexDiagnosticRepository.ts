import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";
import { ETableNames } from "../../database/ETableNames";
import type { Knex } from "knex";
export class KnexDiagnosticRepository implements IDiagnosticRepository {
  constructor(private readonly knex: Knex) {}

  async save(
    { patientId, ...data }: DiagnosticDTO,
    userId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.DIAGNOSTICS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async saveMany(data: (DiagnosticDTO & { userId: string })[]): Promise<void> {
    await this.knex(ETableNames.DIAGNOSTICS).insert(data);
  }

  async update(
    { patientId, ...data }: DiagnosticDTO,
    userId: string,
  ): Promise<void> {
    await this.knex(ETableNames.DIAGNOSTICS)
      .update(data)
      .where({ patientId, userId });
  }

  async get(patientId: string, userId: string): Promise<DiagnosticDTO> {
    const result = await this.knex(ETableNames.DIAGNOSTICS)
      .first("*")
      .where({ patientId, userId });

    return result;
  }
}
