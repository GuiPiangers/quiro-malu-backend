import { consult } from "../../database/mySqlConnection";
import { UserDTO } from "../../models/entities/User";
import { IUserRepository } from "./IUserRepository";

export class MySqlUserRepository implements IUserRepository {
    getById(id: string): Promise<UserDTO[]> {
        const sql = "SELECT * FROM users WHERE id = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return consult(errorMessage, sql, id)
    }

    getByEmail(email: string): Promise<UserDTO[]> {
        const sql = "SELECT * FROM users WHERE email = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return consult(errorMessage, sql, email)
    }

    create(data: UserDTO): Promise<void> {
        const sql = "INSERT INTO users SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return consult(errorMessage, sql, data)
    }
}