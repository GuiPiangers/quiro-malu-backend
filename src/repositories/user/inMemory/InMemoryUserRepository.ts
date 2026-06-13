import { UserDTO } from '../../../core/authentication/models/User'
import type { ClinicUserListItem, IUserRepository } from '../IUserRepository'

export class InMemoryUserRepository implements IUserRepository {
  private dbUsers: UserDTO[] = []

  async save(user: UserDTO): Promise<void> {
    this.dbUsers.push(user)
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    const selectedUser = await this.dbUsers.find((user) => user.email === email)

    if (selectedUser) return [selectedUser]
    return []
  }

  async getById(params: {
    userId: string
    clinicId: string
  }): Promise<UserDTO[]> {
    const selectedUser = await this.dbUsers.find(
      (user) => user.id === params.userId && user.clinicId === params.clinicId,
    )

    if (selectedUser) return [selectedUser]
    return []
  }

  async listByClinicId(params: {
    clinicId: string
  }): Promise<ClinicUserListItem[]> {
    return this.dbUsers
      .filter((u) => u.clinicId === params.clinicId)
      .map((u) => ({
        id: u.id!,
        name: u.name,
        email: u.email,
        phone: u.phone,
        clinicId: u.clinicId,
        roleId: u.roleId ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  async deleteByIdForClinic(params: {
    id: string
    clinicId: string
  }): Promise<number> {
    const idx = this.dbUsers.findIndex(
      (u) => u.id === params.id && u.clinicId === params.clinicId,
    )
    if (idx === -1) return 0
    this.dbUsers.splice(idx, 1)
    return 1
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    const user = this.dbUsers.find((u) => u.id === userId)
    if (user) user.password = passwordHash
  }

  async activateIfPending(userId: string): Promise<void> {
    const user = this.dbUsers.find((u) => u.id === userId)
    if (user && user.status === 'pending') user.status = 'active'
  }
}
