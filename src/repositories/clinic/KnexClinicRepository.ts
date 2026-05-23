import type { Knex } from 'knex'
import { Clinic, ClinicDTO } from '../../core/clinics/models/Clinic'
import { ETableNames } from '../../database/ETableNames'
import { IClinicRepository } from './IClinicRepository'

export class KnexClinicRepository implements IClinicRepository {
  constructor(private readonly knex: Knex) {}

  async save(clinic: Clinic): Promise<Clinic> {
    await this.knex(ETableNames.CLINICS).insert(clinic.getDTO())
    return clinic
  }

  async findById(id: string): Promise<Clinic | null> {
    const clinic = await this.knex<ClinicDTO>(ETableNames.CLINICS)
      .first('*')
      .where({ id })

    return clinic
      ? new Clinic(clinic)
      : null
  }

  async findByName(name: string): Promise<Clinic | null> {
    const clinic = await this.knex<ClinicDTO>(ETableNames.CLINICS)
      .first('*')
      .where({ name })

    return clinic
      ? new Clinic(clinic)
      : null
  }
}
