import { query } from "../../database/mySqlConnection";
import { ILocationRepository } from "./ILocationRepository";
import { LocationDTO } from "../../core/shared/Location";

export class MySqlLocationRepository implements ILocationRepository {
  save(data: LocationDTO, patientId: string, userId: string): Promise<void> {
    const sql = "INSERT INTO locations SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...data,
      state: data.state,
      userId,
      patientId,
    });
  }

  update(data: LocationDTO, patientId: string, userId: string): Promise<void> {
    const sql = "UPDATE locations SET ? WHERE patientId = ? and userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [data, patientId, userId]);
  }

  getLocation(patientId: string, userId: string): Promise<LocationDTO[]> {
    const sql = "SELECT * FROM locations WHERE patientId = ? and userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    return query(errorMessage, sql, [patientId, userId]);
  }
}
