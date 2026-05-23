import { ServiceDTO } from '../../core/service/models/Service'
import { ETableNames } from '../../database/ETableNames'
import { IServiceRepository, listServiceProps } from './IServiceRepository'
import type { Knex } from 'knex'

export class KnexServiceRepository implements IServiceRepository {
  constructor(private readonly knex: Knex) {}

  async save({
    clinicId,
    ...data
  }: ServiceDTO & { clinicId: string }): Promise<void> {
    return await this.knex(ETableNames.SERVICES).insert({
      ...data,
      clinicId,
    })
  }

  async update({
    id,
    clinicId,
    ...data
  }: ServiceDTO & { id: string; clinicId: string }): Promise<void> {
    await this.knex(ETableNames.SERVICES)
      .update(data)
      .where({ id, clinicId })
  }

  async list({ clinicId, config }: listServiceProps): Promise<ServiceDTO[]> {
    const order = config?.search
      ? 'name'
      : 'created_at'
    const orderDirection = config?.search
      ? 'asc'
      : 'desc'

    const result = this.knex(ETableNames.SERVICES)
      .select('*')
      .where({ clinicId })
      .andWhere('name', 'like', `%${config?.search ?? ''}%`)
      .orderBy(order, orderDirection)

    if (config?.limit && config?.offSet) {
      return await result.limit(config.limit).offset(config.offSet)
    }
    return await result
  }

  async count({
    clinicId,
    search,
  }: {
    clinicId: string;
    search?: string;
  }): Promise<[{ total: number }]> {
    const [result] = await this.knex(ETableNames.SERVICES)
      .count('id as total')
      .where({ clinicId })
      .andWhere('name', 'like', `%${search ?? ''}%`)
    return [result] as [{ total: number }]
  }

  async get({
    id,
    clinicId,
  }: {
    id: string;
    clinicId: string;
  }): Promise<ServiceDTO | null> {
    const row = await this.knex(ETableNames.SERVICES)
      .select('*')
      .where({ clinicId, id })
      .first()

    return row ?? null
  }

  async getByName({
    name,
    clinicId,
  }: {
    name: string;
    clinicId: string;
  }): Promise<ServiceDTO[]> {
    return await this.knex(ETableNames.SERVICES)
      .select('*')
      .where({ clinicId, name })
  }

  async delete({ id, clinicId }: { id: string; clinicId: string }): Promise<void> {
    await this.knex(ETableNames.SERVICES)
      .where({ id, clinicId })
      .del()
  }
}
