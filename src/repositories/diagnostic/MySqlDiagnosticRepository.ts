import { query } from "../../server/mySqlConnection";
import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";

export class MySqlDiagnosticRepository implements IDiagnosticRepository {

    save({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
        const sql = "INSERT INTO diagnostic SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            userId: userId,
            patientId: patientId
        })
    }

    update({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
        const sql = "UPDATE diagnostic SET ? WHERE patientId = ? and userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, patientId, userId])
    }

    get(patientId: string, userId: string): Promise<DiagnosticDTO[]> {
        const sql = "SELECT * FROM diagnostic WHERE patientId = ? and userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }

}