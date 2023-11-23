import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";
import { query } from "../server/mySqlConnection";
import { ISchedulingRepository } from "../scheduling/ISchedulingRepository";

export class MySqlSchedulingRepository implements ISchedulingRepository {
    save({ userId, createAt, updateAt, ...data }: SchedulingDTO & { userId: string }): Promise<void> {
        const sql = "INSERT INTO scheduling SET ?"
        const errorMessage = "Falha ao adicionar o serviço"

        return query(errorMessage, sql, { ...data, userId: userId })
    }
    update({ id, userId, createAt, updateAt, ...data }: SchedulingDTO & { id: string, userId: string }): Promise<void> {
        const sql = "UPDATE scheduling SET ? WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = "Falha ao atualizar o serviço"

        return query(errorMessage, sql, [data, id, data.patientId, userId])
    }
    list({ userId, patientId, config, }: { userId: string, patientId: string, config?: { limit: number, offSet: number } }): Promise<SchedulingDTO[]> {
        const sql = "SELECT *  FROM scheduling WHERE patientId = ? AND userId = ? ORDER BY updateAt DESC LIMIT ? OFFSET ?"
        const errorMessage = `Não foi possível realizar a busca`
        return query(errorMessage, sql, [patientId, userId, config?.limit, config?.offSet])
    }
    count({ patientId, userId }: { patientId: string, userId: string }): Promise<[{ total: number }]> {
        const sql = "SELECT COUNT(id) AS total FROM scheduling WHERE patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`
        return query(errorMessage, sql, [patientId, userId])
    }

    get({ patientId, id, userId }: { id: string, patientId: string, userId: string }): Promise<SchedulingDTO[]> {
        const sql = "SELECT * FROM scheduling WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [id, patientId, userId])
    }

    delete({ id, patientId, userId }: { id: string, patientId: string, userId: string }): Promise<void> {
        const sql = "DELETE FROM scheduling WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível deletar o serviço`

        return query(errorMessage, sql, [id, patientId, userId])
    }

}