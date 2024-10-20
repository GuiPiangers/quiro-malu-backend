import { query } from "../../server/mySqlConnection";
import { ILocationRepository } from "./ILocationRepository";
import { LocationDTO } from "../../core/shared/Location";

export class MySqlLocationRepository implements ILocationRepository {

    save(data: LocationDTO, patientId: string, userId: string): Promise<void> {
        const sql = "INSERT INTO location SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            state: data.state,
            userId: userId,
            patientId: patientId
        })
    }
    update(data: LocationDTO, patientId: string, userId: string): Promise<void> {
        const sql = "UPDATE location SET ? WHERE patientId = ? and userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, patientId, userId])
    }
    getLocation(patientId: string, userId: string): Promise<LocationDTO[]> {
        const sql = "SELECT * FROM location WHERE patientId = ? and userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }

}