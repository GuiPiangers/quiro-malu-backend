import { UserDTO } from "../../../core/authentication/models/User";
import type { ClinicUserListItem, IUserRepository } from "../IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  private dbUsers: UserDTO[] = [];

  async save(user: UserDTO): Promise<void> {
    this.dbUsers.push(user);
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    const selectedUser = await this.dbUsers.find(
      (user) => user.email === email,
    );

    if (selectedUser) return [selectedUser];
    else return [];
  }

  async getById(id: string): Promise<UserDTO[]> {
    const selectedUser = await this.dbUsers.find((user) => user.id === id);

    if (selectedUser) return [selectedUser];
    else return [];
  }

  async listByClinicId(params: {
    clinicId: string;
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
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
