/* eslint-disable eqeqeq */
import { query } from "../../database/mySqlConnection";
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";

export class MySqlAnamnesisRepository implements IAnamnesisRepository {
  save({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
    const sql = "INSERT INTO anamnesis SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...getValidObjectValues(data),
      userId,
      patientId,
    });
  }

  async saveMany(data: (AnamnesisDTO & { userId: string })[]): Promise<void> {
    await Knex(ETableNames.ANAMNESIS).insert(data);
  }

  update({ patientId, ...data }: AnamnesisDTO, userId: string): Promise<void> {
    const sql = "UPDATE anamnesis SET ? WHERE patientId = ? and userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [
      getValidObjectValues(data),
      patientId,
      userId,
    ]);
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
    return result.map((anamnesis) =>
      getValidObjectValues({
        ...anamnesis,
        underwentSurgery: anamnesis.underwentSurgery == 1,
        useMedicine: anamnesis.useMedicine == 1,
      }),
    );
  }
}
