import { ServiceDTO } from "../../core/service/models/Service";
import { query } from "../../server/mySqlConnection";
import { IServiceRepository } from "../service/IServiceRepository";

export class MySqlServiceRepository implements IServiceRepository {
    save({ userId, ...data }: ServiceDTO & { userId: string }): Promise<void> {
        const sql = "INSERT INTO services SET ?"
        const errorMessage = "Falha ao adicionar o serviço"

        return query(errorMessage, sql, { ...data, userId: userId })
    }
    update({ id, userId, ...data }: ServiceDTO & { id: string, userId: string }): Promise<void> {
        const sql = "UPDATE services SET ? WHERE id = ? and userId = ?"
        const errorMessage = "Falha ao atualizar o serviço"

        return query(errorMessage, sql, [data, id, userId])
    }
    list({ userId, config }: { userId: string, config?: { limit: number, offSet: number } }): Promise<ServiceDTO[]> {
        const sql = "SELECT *  FROM services WHERE userId = ? ORDER BY updateAt DESC LIMIT ? OFFSET ?"
        const errorMessage = `Não foi possível realizar a busca`
        return query(errorMessage, sql, [userId, config?.limit, config?.offSet])
    }
    count({ userId }: { userId: string }): Promise<[{ total: number }]> {
        const sql = "SELECT COUNT(id) AS total FROM services WHERE userId = ?"
        const errorMessage = `Não foi possível realizar a busca`
        return query(errorMessage, sql, [userId])
    }

    get({ id, userId }: { id: string, userId: string }): Promise<ServiceDTO[]> {
        const sql = "SELECT * FROM services WHERE id = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [id, userId])
    }
    getByName({ name, userId }: { name: string, userId: string }): Promise<ServiceDTO[]> {
        const sql = "SELECT * FROM services WHERE name = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [name, userId])
    }
    delete({ id, userId }: { id: string, userId: string }): Promise<void> {
        const sql = "DELETE FROM services WHERE id = ? AND userId = ?"
        const errorMessage = `Não foi possível deletar o serviço`

        return query(errorMessage, sql, [id, userId])
    }

}