import { UserDTO } from "../../core/authentication/models/User";
import type { ClinicUserListItem, IUserRepository } from "./IUserRepository";
import { ETableNames } from "../../database/ETableNames";
import type { Knex } from "knex";

export class KnexUserRepository implements IUserRepository {
  constructor(private readonly knex: Knex) {}

  async listByClinicId(params: {
    clinicId: string;
  }): Promise<ClinicUserListItem[]> {
    const rows = await this.knex(ETableNames.USERS)
      .select("id", "name", "email", "phone", "clinicId", "roleId")
      .where({ clinicId: params.clinicId })
      .orderBy("name", "asc");

    return rows.map((row) => ({
      ...row,
      roleId: row.roleId ?? null,
    }));
  }

  async getById(id: string): Promise<UserDTO[]> {
    return await this.knex(ETableNames.USERS).select("*").where({ id });
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    return await this.knex(ETableNames.USERS).select("*").where({ email });
  }

  async save(data: UserDTO): Promise<void> {
    return await this.knex(ETableNames.USERS).insert(data);
  }
}
