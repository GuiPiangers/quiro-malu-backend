import { query } from "../server/mySqlConnection";
import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";

export class MySqlProgressRepository implements IProgressRepository {

    save({ patientId, ...data }: ProgressDTO, userId: string): Promise<void> {
        const sql = "INSERT INTO progress SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            userId: userId,
            patientId: patientId
        })
    }

    update({ id, patientId, ...data }: ProgressDTO, userId: string): Promise<void> {
        const sql = "UPDATE progress SET ? WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, id, patientId, userId])
    }

    get(id: string, patientId: string, userId: string): Promise<ProgressDTO[]> {
        const sql = "SELECT * FROM progress WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [id, patientId, userId])
    }

    list(patientId: string, userId: string): Promise<ProgressDTO[]> {
        const sql = "SELECT * FROM progress WHERE patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }

    async delete(id: string, patientId: string, userId: string): Promise<void> {
        const sql = "DELETE FROM progress WHERE id = ? AND patientId = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        await query(errorMessage, sql, [id, patientId, userId])
    }

}