import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";

export class MySqlProgressRepository implements IProgressRepository {
  async getByScheduling({
    patientId,
    schedulingId,
    userId,
  }: {
    schedulingId: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    const result = await Knex(ETableNames.PROGRESS)
      .column(
        "id",
        "patientId",
        "userId",
        "service",
        "actualProblem",
        "procedures",
        "schedulingId",
        Knex.raw('DATE_FORMAT(date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({ schedulingId, patientId, userId });

    return result;
  }

  async save({
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    return await Knex(ETableNames.PROGRESS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async update({
    id,
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    await Knex(ETableNames.PROGRESS).update(data).where({
      id,
      patientId,
      userId,
    });
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
    const result = await Knex(ETableNames.PROGRESS)
      .column(
        "id",
        "patientId",
        "userId",
        "service",
        "actualProblem",
        "procedures",
        "schedulingId",
        Knex.raw('DATE_FORMAT(date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({ id, patientId, userId });

    return result;
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
    const query = Knex(ETableNames.PROGRESS)
      .column(
        "id",
        "patientId",
        "userId",
        "service",
        "actualProblem",
        "procedures",
        "schedulingId",
        Knex.raw('DATE_FORMAT(date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({ patientId, userId })
      .orderBy("date", "desc");

    if (config) {
      return await query.limit(config.limit).offset(config.offSet);
    }

    return await query;
  }

  async count({
    patientId,
    userId,
  }: {
    patientId: string;
    userId: string;
  }): Promise<[{ total: number }]> {
    const [result] = await Knex(ETableNames.PROGRESS)
      .count("id as total")
      .where({ userId, patientId });

    return [result] as [{ total: number }];
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
    await Knex(ETableNames.PROGRESS).where({ id, patientId, userId }).del();
  }
}
