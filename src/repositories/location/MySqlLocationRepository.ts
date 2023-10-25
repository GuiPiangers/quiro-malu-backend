import { PatientDTO } from "@quiromalu/core/src/models/entities/Patient";
import { query } from "../server/mySqlConnection";
import { ILocationRepository } from "@quiromalu/core/src/repositories/location/ILocatinRepository";
import { LocationDTO } from "@quiromalu/core/src/models/shared/Location";

export class MySqlLocationRepository implements ILocationRepository {

    save(data: LocationDTO, patientId: string, userId: string): Promise<void> {
        const sql = "INSERT INTO location SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, {
            ...data,
            state: data.state?.name || null,
            userId: userId,
            patientId: patientId
        })
    }
    update(data: LocationDTO, patientId: string): Promise<void> {
        const sql = "UPDATE location SET ? WHERE patientId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, patientId])
    }
    getLocation(patientId: string): Promise<LocationDTO[]> {
        const sql = "SELECT * FROM location WHERE patientId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId])
    }

}