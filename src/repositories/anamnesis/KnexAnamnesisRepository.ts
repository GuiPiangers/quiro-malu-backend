/* eslint-disable eqeqeq */
import { IAnamnesisRepository } from './IAnamnesisRepository'
import { AnamnesisDTO } from '../../core/patients/models/Anamnesis'
import { getValidObjectValues } from '../../utils/getValidObjectValues'
import { ETableNames } from '../../database/ETableNames'
import type { Knex } from 'knex'

export class KnexAnamnesisRepository implements IAnamnesisRepository {
  constructor(private readonly knex: Knex) {}

  async save(
    { patientId, ...data }: AnamnesisDTO,
    clinicId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.ANAMNESIS).insert({
      ...data,
      clinicId,
      patientId,
    })
  }

  async saveMany(data: (AnamnesisDTO & { clinicId: string })[]): Promise<void> {
    await this.knex(ETableNames.ANAMNESIS).insert(
      data.map(({ clinicId, ...anamnesis }) => ({
        ...anamnesis,
        clinicId,
      })),
    )
  }

  async update(
    { patientId, ...data }: AnamnesisDTO,
    clinicId: string,
  ): Promise<void> {
    await this.knex(ETableNames.ANAMNESIS)
      .update(data)
      .where({ patientId, clinicId })
  }

  async get(patientId: string, clinicId: string): Promise<AnamnesisDTO> {
    const result = await this.knex(ETableNames.ANAMNESIS)
      .first('*')
      .where({ patientId, clinicId })

    const underwentSurgery = result ? result.underwentSurgery == 1 : undefined
    const useMedicine = result ? result.useMedicine == 1 : undefined

    return getValidObjectValues({
      ...result,
      underwentSurgery,
      useMedicine,
    })
  }
}
