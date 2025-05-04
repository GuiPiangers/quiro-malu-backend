import { UserDTO } from "../../core/authentication/models/User";
import { IUserRepository } from "./IUserRepository";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";

export class KnexUserRepository implements IUserRepository {
  async getById(id: string): Promise<UserDTO[]> {
    return await Knex(ETableNames.USERS).select("*").where({ id });
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    return await Knex(ETableNames.USERS).select("*").where({ email });
  }

  async save(data: UserDTO): Promise<void> {
    return await Knex(ETableNames.USERS).insert(data);
  }
}
