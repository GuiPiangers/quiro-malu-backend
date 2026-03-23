import {
  Scheduling,
  SchedulingDTO,
} from "../../core/scheduling/models/Scheduling";
import { SchedulingWithPatientDTO } from "../../core/scheduling/models/SchedulingWithPatient";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import {
  ISchedulingRepository,
  ListBetweenDatesParams,
  UpdateSchedulingParams,
} from "./ISchedulingRepository";

export class MySqlSchedulingRepository implements ISchedulingRepository {
  async listBetweenDates({
    endDate,
    startDate,
    userId,
  }: ListBetweenDatesParams): Promise<Scheduling[]> {
    const result = await Knex(ETableNames.SCHEDULES)
      .select(
        "id",
        "userId",
        "patientId",
        Knex.raw(`DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date`),
        "duration",
        "status",
        "service",
      )
      .where({
        userId,
      })
      .andWhereBetween("date", [startDate.dateTime, endDate.dateTime]);

    return result.map((schedulingDTO) => new Scheduling(schedulingDTO));
  }

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
  }: UpdateSchedulingParams): Promise<void> {
    await Knex(ETableNames.SCHEDULES).update(data).where({ id, userId });
  }

  async list({
    userId,
    date,
  }: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<SchedulingWithPatientDTO[]> {
    try {
      const result = await Knex(`${ETableNames.SCHEDULES} as s`)
        .leftJoin(`${ETableNames.PATIENTS} as p`, function joinPatients() {
          this.on("s.patientId", "=", "p.id").andOn(
            "s.userId",
            "=",
            "p.userId",
          );
        })
        .select(
          "s.id",
          "s.patientId",
          Knex.raw("p.name as patient"),
          "p.phone",
          Knex.raw(`DATE_FORMAT(s.date, '%Y-%m-%dT%H:%i') as date`),
          "s.duration",
          "s.service",
          "s.status",
          Knex.raw("s.updated_at as updateAt"),
          Knex.raw("s.created_at as createAt"),
        )
        .where("s.userId", userId)
        .andWhereRaw("date_format(s.date, '%Y-%m-%d') = ?", [date])
        .orderBy("s.updated_at", "desc");

      return result.map((scheduling) =>
        getValidObjectValues(scheduling as SchedulingWithPatientDTO),
      );
    } catch {
      throw new ApiError("Não foi possível realizar a busca", 500);
    }
  }

  async count({
    date,
    userId,
  }: {
    date: string;
    userId: string;
  }): Promise<[{ total: number }]> {
    try {
      const [result] = await Knex(ETableNames.SCHEDULES)
        .count("id as total")
        .where({ userId })
        .andWhereRaw("date_format(date, '%Y-%m-%d') = ?", [date]);

      const total = Number((result as any)?.total ?? 0);
      return [{ total }];
    } catch {
      throw new ApiError("Não foi possível realizar a busca", 500);
    }
  }

  async qdtSchedulesByDay({
    month,
    year,
    userId,
  }: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]> {
    try {
      const result = await Knex(ETableNames.SCHEDULES)
        .select(
          Knex.raw("date_format(date, '%Y-%m-%d') as formattedDate"),
          Knex.raw("count(id) as qtd"),
        )
        .where({ userId })
        .andWhereRaw("month(date) = ? AND year(date) = ?", [month, year])
        .groupByRaw("date_format(date, '%Y-%m-%d')");

      return result.map((row: any) => ({
        formattedDate: row.formattedDate,
        qtd: Number(row.qtd ?? 0),
      }));
    } catch {
      throw new ApiError("Não foi possível realizar a busca", 500);
    }
  }

  async get({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<SchedulingWithPatientDTO[]> {
    try {
      const result = await Knex(`${ETableNames.SCHEDULES} as s`)
        .leftJoin(`${ETableNames.PATIENTS} as p`, function joinPatients() {
          this.on("s.patientId", "=", "p.id").andOn(
            "s.userId",
            "=",
            "p.userId",
          );
        })
        .select(
          "s.id",
          "s.patientId",
          Knex.raw("p.name as patient"),
          "p.phone",
          Knex.raw(`DATE_FORMAT(s.date, '%Y-%m-%dT%H:%i') as date`),
          "s.duration",
          "s.service",
          "s.status",
          Knex.raw("s.updated_at as updateAt"),
          Knex.raw("s.created_at as createAt"),
        )
        .where({ "s.id": id, "s.userId": userId });

      return result.map((scheduling) =>
        getValidObjectValues(scheduling as SchedulingWithPatientDTO),
      );
    } catch {
      throw new ApiError("Não foi possível realizar a busca", 500);
    }
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    await Knex(ETableNames.SCHEDULES).where({ id, userId }).del();
  }
}
