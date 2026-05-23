import { DiagnosticDTO } from '../../core/patients/models/Diagnostic'
import { IDiagnosticRepository } from './IDiagnosticRepository'
import { ETableNames } from '../../database/ETableNames'
import type { Knex } from 'knex'
export class KnexDiagnosticRepository implements IDiagnosticRepository {
  constructor(private readonly knex: Knex) {}

  async save(
    { patientId, ...data }: DiagnosticDTO,
    clinicId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.DIAGNOSTICS).insert({
      ...data,
      clinicId,
      patientId,
    })
  }

  async saveMany(
    data: (DiagnosticDTO & { clinicId: string })[],
  ): Promise<void> {
    await this.knex(ETableNames.DIAGNOSTICS).insert(
      data.map(({ clinicId, ...diagnostic }) => ({
        ...diagnostic,
        clinicId,
      })),
    )
  }

  async update(
    { patientId, ...data }: DiagnosticDTO,
    clinicId: string,
  ): Promise<void> {
    await this.knex(ETableNames.DIAGNOSTICS)
      .update(data)
      .where({ patientId, clinicId })
  }

  async get(patientId: string, clinicId: string): Promise<DiagnosticDTO> {
    const result = await this.knex(ETableNames.DIAGNOSTICS)
      .first('*')
      .where({ patientId, clinicId })

    return result
  }
}
