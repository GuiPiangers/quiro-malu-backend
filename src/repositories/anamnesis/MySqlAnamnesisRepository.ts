import { query } from "../server/mySqlConnection";
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";

export class MySqlAnamnesisRepository implements IAnamnesisRepository {

    save({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
        const sql = "INSERT INTO anamnesis SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            userId: userId,
            patientId: patientId
        })
    }

    update({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
        const sql = "UPDATE anamnesis SET ? WHERE patientId = ? and userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, patientId, userId])
    }

    get(patientId: string, userId: string): Promise<AnamnesisDTO[]> {
        const sql = "SELECT * FROM anamnesis WHERE patientId = ? and userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }

}