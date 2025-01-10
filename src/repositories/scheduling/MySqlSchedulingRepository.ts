import {
  Scheduling,
  SchedulingDTO,
} from "../../core/scheduling/models/Scheduling";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { query } from "../../database/mySqlConnection";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { ISchedulingRepository } from "../scheduling/ISchedulingRepository";

export class MySqlSchedulingRepository implements ISchedulingRepository {
  async save({
    createAt,
    updateAt,
    ...data
  }: SchedulingDTO & { userId: string }): Promise<void> {
    await Knex(ETableNames.SCHEDULES).insert(data);
  }

  async update({
    id,
    userId,
    createAt,
    updateAt,
    ...data
  }: SchedulingDTO & { id: string; userId: string }): Promise<void> {
    await Knex(ETableNames.SCHEDULES).update(data).where({ id, userId });
  }

  async list({
    userId,
    date,
  }: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<(SchedulingDTO & { patient: string; phone: string })[]> {
    const sql =
      "SELECT s.id, s.patientId, p.name as patient, p.phone, DATE_FORMAT(s.date, '%Y-%m-%dT%H:%i') as date, s.duration, s.service, s.status, s.updated_at as updateAt, s.created_at as createAt FROM schedules as s LEFT JOIN patients as p ON s.patientId = p.id AND s.userId = p.userId WHERE s.userId = ? AND date_format(s.date, '%Y-%m-%d') = ? ORDER BY s.updated_at DESC ";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<
      (SchedulingDTO & { patient: string; phone: string })[]
    >(errorMessage, sql, [userId, date]);
    return result.map((scheduling) => getValidObjectValues(scheduling));
  }

  count({
    date,
    userId,
  }: {
    date: string;
    userId: string;
  }): Promise<[{ total: number }]> {
    const sql =
      "SELECT COUNT(id) AS total FROM schedules WHERE userId = ? AND date_format(date, '%Y-%m-%d') = ?";
    const errorMessage = `Não foi possível realizar a busca`;
    return query(errorMessage, sql, [userId, date]);
  }

  qdtSchedulesByDay({
    month,
    year,
    userId,
  }: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]> {
    const sql =
      "SELECT date_format(date, '%Y-%m-%d') as formattedDate, count(id) as qtd from schedules WHERE month(date) = ? AND year(date) = ? AND userId = ? group by formattedDate";
    const errorMessage = `Não foi possível realizar a busca`;
    return query(errorMessage, sql, [month, year, userId]);
  }

  async get({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<SchedulingDTO[]> {
    const sql =
      "SELECT id, userId, patientId, duration, service, status, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date FROM schedules WHERE id = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<SchedulingDTO[]>(errorMessage, sql, [
      id,
      userId,
    ]);
    return result.map((scheduling) => getValidObjectValues(scheduling));
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    const sql = "DELETE FROM schedules WHERE id = ? AND userId = ?";
    await Knex(ETableNames.SCHEDULES).where({ id, userId }).del();
  }
}
