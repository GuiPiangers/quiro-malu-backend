import { query } from "../../database/mySqlConnection";
import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";
import { getValidObjectValues } from "../../utils/getValidObjectValues";

export class MySqlProgressRepository implements IProgressRepository {
  save({
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    const sql = "INSERT INTO progress SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...getValidObjectValues(data),
      userId,
      patientId,
    });
  }

  update({
    id,
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    const sql =
      "UPDATE progress SET ? WHERE id = ? AND patientId = ? AND userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [
      getValidObjectValues(data),
      id,
      patientId,
      userId,
    ]);
  }

  async get({
    id,
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    const sql =
      "SELECT * FROM progress WHERE id = ? AND patientId = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    const result = await query<ProgressDTO[]>(errorMessage, sql, [
      id,
      patientId,
      userId,
    ]);

    return result.map((progress) => getValidObjectValues(progress));
  }

  async list({
    patientId,
    userId,
    config,
  }: {
    patientId: string;
    userId: string;
    config?: { limit: number; offSet: number };
  }): Promise<ProgressDTO[]> {
    const sql =
      "SELECT * FROM progress WHERE patientId = ? AND userId = ? ORDER BY date DESC LIMIT ? OFFSET ?";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<ProgressDTO[]>(errorMessage, sql, [
      patientId,
      userId,
      config?.limit,
      config?.offSet,
    ]);

    return result.map((progress) => getValidObjectValues(progress));
  }

  count({
    patientId,
    userId,
  }: {
    patientId: string;
    userId: string;
  }): Promise<[{ total: number }]> {
    const sql =
      "SELECT COUNT(id) AS total FROM progress WHERE patientId = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    return query(errorMessage, sql, [patientId, userId]);
  }

  async delete({
    id,
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }): Promise<void> {
    const sql =
      "DELETE FROM progress WHERE id = ? AND patientId = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    await query(errorMessage, sql, [id, patientId, userId]);
  }
}
