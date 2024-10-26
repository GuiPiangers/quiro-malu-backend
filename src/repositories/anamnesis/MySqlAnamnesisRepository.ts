/* eslint-disable eqeqeq */
import { query } from "../../database/mySqlConnection";
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { Anamnesis, AnamnesisDTO } from "../../core/patients/models/Anamnesis";

export class MySqlAnamnesisRepository implements IAnamnesisRepository {
  save({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
    const sql = "INSERT INTO anamnesis SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...data,
      userId,
      patientId,
    });
  }

  update({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
    const sql = "UPDATE anamnesis SET ? WHERE patientId = ? and userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [data, patientId, userId]);
  }

  async get(patientId: string, userId: string): Promise<AnamnesisDTO[]> {
    const sql = "SELECT * FROM anamnesis WHERE patientId = ? and userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<
      (Omit<AnamnesisDTO, "underwentSurgery" | "useMedicine"> & {
        underwentSurgery: number;
        useMedicine: number;
      })[]
    >(errorMessage, sql, [patientId, userId]);
    return result.map((anamnesis) => ({
      ...anamnesis,
      underwentSurgery: anamnesis.underwentSurgery == 1,
      useMedicine: anamnesis.useMedicine == 1,
    }));
  }
}
