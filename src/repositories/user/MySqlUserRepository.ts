import { query } from "../../database/mySqlConnection";
import { UserDTO } from "../../core/authentication/models/User";
import { IUserRepository } from "./IUserRepository";

export class MySqlUserRepository implements IUserRepository {
  async getById(id: string): Promise<UserDTO[]> {
    const sql = "SELECT * FROM users WHERE id = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    return await query(errorMessage, sql, id);
  }

  async getByEmail(email: string): Promise<UserDTO[]> {
    const sql = "SELECT * FROM users WHERE email = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    return await query(errorMessage, sql, email);
  }

  async save(data: UserDTO): Promise<void> {
    const sql = "INSERT INTO users SET ?";
    const errorMessage = "Falha ao adicionar o usuário";
    return await query(errorMessage, sql, data);
  }
}
