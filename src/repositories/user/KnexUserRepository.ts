import { UserDTO } from '../../core/authentication/models/User'
import type { ClinicUserListItem, IUserRepository } from './IUserRepository'
import { ETableNames } from '../../database/ETableNames'
import type { Knex } from 'knex'

export class KnexUserRepository implements IUserRepository {
  constructor(private readonly knex: Knex) {}

  async listByClinicId(params: {
    clinicId: string
  }): Promise<ClinicUserListItem[]> {
    const rows = await this.knex(ETableNames.USERS)
      .select('id', 'name', 'email', 'phone', 'clinicId', 'roleId')
      .where({ clinicId: params.clinicId })
      .orderBy('name', 'asc')

    return rows.map((row) => ({
      ...row,
      roleId: row.roleId ?? null,
    }))
  }

  async getById(params: {
    userId: string
    clinicId: string
  }): Promise<UserDTO[]> {
    return await this.knex(ETableNames.USERS)
      .select('*')
      .where({ id: params.userId, clinicId: params.clinicId })
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    return await this.knex(ETableNames.USERS).select('*').where({ email })
  }

  async findById(userId: string): Promise<UserDTO | null> {
    const user = await this.knex(ETableNames.USERS)
      .select('*')
      .where({ id: userId })
      .first()

    return user ?? null
  }

  async save(data: UserDTO): Promise<void> {
    return await this.knex(ETableNames.USERS).insert(data)
  }

  async deleteByIdForClinic(params: {
    id: string
    clinicId: string
  }): Promise<number> {
    return await this.knex(ETableNames.USERS)
      .where({ id: params.id, clinicId: params.clinicId })
      .del()
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.knex(ETableNames.USERS)
      .where({ id: userId })
      .update({ password: passwordHash })
  }

  async updatePasswordAndStatus(params: {
    userId: string
    passwordHash: string
    status: UserDTO['status']
  }): Promise<void> {
    await this.knex(ETableNames.USERS)
      .where({ id: params.userId })
      .update({
        password: params.passwordHash,
        status: params.status,
      })
  }

  async activateIfPending(userId: string): Promise<void> {
    await this.knex(ETableNames.USERS)
      .where({ id: userId, status: 'pending' })
      .update({ status: 'active' })
  }
}
