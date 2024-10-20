import { query } from "../../server/mySqlConnection";
import { UserDTO } from "../../core/authentication/models/User";
import { IUserRepository } from "./IUserRepository";

export class MySqlUserRepository implements IUserRepository {
    getById(id: string): Promise<UserDTO[]> {
        const sql = "SELECT * FROM users WHERE id = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, id)
    }

    getByEmail(email: string): Promise<UserDTO[]> {
        const sql = "SELECT * FROM users WHERE email = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, email)
    }

    save(data: UserDTO): Promise<void> {
        const sql = "INSERT INTO users SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, data)
    }
}