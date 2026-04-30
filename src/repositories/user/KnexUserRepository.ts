import { UserDTO } from "../../core/authentication/models/User";
import { IUserRepository } from "./IUserRepository";
import { ETableNames } from "../../database/ETableNames";
import type { Knex } from "knex";

export class KnexUserRepository implements IUserRepository {
  constructor(private readonly knex: Knex) {}

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
