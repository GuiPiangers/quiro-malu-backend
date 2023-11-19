import { query } from "../server/mySqlConnection";
import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";

export class MySqlProgressRepository implements IProgressRepository {


    save({ patientId, userId, ...data }: ProgressDTO & { userId: string }): Promise<void> {
        const sql = "INSERT INTO progress SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            userId: userId,
            patientId: patientId
        })
    }

    update({ id, patientId, userId, ...data }: ProgressDTO & { userId: string }): Promise<void> {
        const sql = "UPDATE progress SET ? WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, id, patientId, userId])
    }

    get({ id, patientId, userId }: { id: string, patientId: string, userId: string }): Promise<ProgressDTO[]> {
        const sql = "SELECT * FROM progress WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [id, patientId, userId])
    }

    list({ patientId, userId, config }: { patientId: string, userId: string, config?: { limit: number, offSet: number } }): Promise<ProgressDTO[]> {
        const sql = "SELECT * FROM progress WHERE patientId = ? AND userId = ? ORDER BY date DESC LIMIT ? OFFSET ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId, config?.limit, config?.offSet])
    }

    count({ patientId, userId }: { patientId: string; userId: string; }): Promise<[{ total: number }]> {
        const sql = "SELECT COUNT(id) AS total FROM progress WHERE patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }

    async delete({ id, patientId, userId }: { id: string, patientId: string, userId: string }): Promise<void> {
        const sql = "DELETE FROM progress WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        await query(errorMessage, sql, [id, patientId, userId])
    }

}