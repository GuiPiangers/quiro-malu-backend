import type { Knex } from "knex";
import {
  Scheduling,
  SchedulingDTO,
} from "../../core/scheduling/models/Scheduling";
import { SchedulingWithPatientDTO } from "../../core/scheduling/models/SchedulingWithPatient";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import {
  ISchedulingRepository,
  ListBetweenDatesParams,
  UpdateSchedulingParams,
} from "./ISchedulingRepository";

export class KnexSchedulingRepository implements ISchedulingRepository {
  constructor(private readonly knex: Knex) {}

  async listBetweenDates({
    endDate,
    startDate,
    userId,
  }: ListBetweenDatesParams): Promise<Scheduling[]> {
    const result = await this.knex(ETableNames.SCHEDULES)
      .select(
        "id",
        "userId",
        "patientId",
        this.knex.raw(`DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date`),
        this.knex.raw(
          `DATE_FORMAT(reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
        ),
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
    await this.knex(ETableNames.SCHEDULES).insert(data);
  }

  async update({
    id,
    userId,
    createAt,
    updateAt,
    ...data
  }: UpdateSchedulingParams): Promise<void> {
    await this.knex(ETableNames.SCHEDULES).update(data).where({ id, userId });
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
      const result = await this.knex(`${ETableNames.SCHEDULES} as s`)
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
          this.knex.raw("p.name as patient"),
          "p.phone",
          this.knex.raw(`DATE_FORMAT(s.date, '%Y-%m-%dT%H:%i') as date`),
          this.knex.raw(
            `DATE_FORMAT(s.reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
          ),
          "s.duration",
          "s.service",
          "s.status",
          this.knex.raw("s.updated_at as updateAt"),
          this.knex.raw("s.created_at as createAt"),
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
      const [result] = await this.knex(ETableNames.SCHEDULES)
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
      const result = await this.knex(ETableNames.SCHEDULES)
        .select(
          this.knex.raw("date_format(date, '%Y-%m-%d') as formattedDate"),
          this.knex.raw("count(id) as qtd"),
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

  async listIdsByUserId({ userId }: { userId: string }): Promise<string[]> {
    const rows = await this.knex(ETableNames.SCHEDULES)
      .select("id")
      .where({ userId })
      .andWhereRaw("date > NOW()");

    return rows.map((row: { id: string }) => row.id);
  }

  async listPatientIdsByUserIdOrderBySchedulingCountDesc(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    try {
      const rows = await this.knex(`${ETableNames.SCHEDULES} as s`)
        .join(`${ETableNames.PATIENTS} as p`, (join) => {
          join
            .on("p.id", "=", "s.patientId")
            .andOn("p.userId", "=", "s.userId");
        })
        .where("s.userId", userId)
        .where((b) => {
          b.whereNull("s.status").orWhere("s.status", "<>", "Cancelado");
        })
        .groupBy("s.patientId")
        .select("s.patientId as patientId")
        .orderByRaw("COUNT(*) DESC, MAX(p.created_at) DESC")
        .limit(limit);

      return rows.map((row: { patientId: string }) => String(row.patientId));
    } catch (error: any) {
      throw new ApiError(error.message, 500);
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
      const result = await this.knex(`${ETableNames.SCHEDULES} as s`)
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
          this.knex.raw("p.name as patient"),
          "p.phone",
          this.knex.raw(`DATE_FORMAT(s.date, '%Y-%m-%dT%H:%i') as date`),
          this.knex.raw(
            `DATE_FORMAT(s.reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
          ),
          "s.duration",
          "s.service",
          "s.status",
          this.knex.raw("s.updated_at as updateAt"),
          this.knex.raw("s.created_at as createAt"),
        )
        .where({ "s.id": id, "s.userId": userId });

      return result.map((scheduling) =>
        getValidObjectValues(scheduling as SchedulingWithPatientDTO),
      );
    } catch {
      throw new ApiError("Não foi possível realizar a busca", 500);
    }
  }

  async listFromNowWithinMinutes({
    userId,
    offsetMinutes,
  }: {
    userId: string;
    offsetMinutes: number;
  }): Promise<Scheduling[]> {
    const safeOffset = Math.max(offsetMinutes, 0);

    const result = await this.knex(ETableNames.SCHEDULES)
      .select(
        "id",
        "patientId",
        this.knex.raw(`DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date`),
        this.knex.raw(
          `DATE_FORMAT(reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
        ),
        "duration",
        "status",
        "service",
      )
      .where({ userId })
      .andWhereBetween("date", [
        this.knex.raw("NOW()"),
        this.knex.raw("DATE_ADD(NOW(), INTERVAL ? MINUTE)", [safeOffset]),
      ]);

    return result.map((row) => new Scheduling(row));
  }

  async listScheduledInMinutes({
    userId,
    offsetMinutes,
  }: {
    userId: string;
    offsetMinutes: number;
  }): Promise<Scheduling[]> {
    const safeOffset = Math.max(offsetMinutes, 0);
    const startOffset = safeOffset - 5;
    const endOffset = safeOffset + 5;

    const result = await this.knex(ETableNames.SCHEDULES)
      .select(
        "id",
        "patientId",
        this.knex.raw(`DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date`),
        this.knex.raw(
          `DATE_FORMAT(reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
        ),
        "duration",
        "status",
        "service",
      )
      .where({ userId })
      .andWhereBetween("date", [
        this.knex.raw("DATE_ADD(NOW(), INTERVAL ? MINUTE)", [startOffset]),
        this.knex.raw("DATE_ADD(NOW(), INTERVAL ? MINUTE)", [endOffset]),
      ]);

    return result.map((row) => new Scheduling(row));
  }

  async listUpcoming({
    userId,
    windowMinutes,
  }: {
    userId: string;
    windowMinutes: number;
  }): Promise<Scheduling[]> {
    const safeWindow = Math.max(windowMinutes, 0);

    const result = await this.knex(ETableNames.SCHEDULES)
      .select(
        "id",
        "patientId",
        this.knex.raw(`DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date`),
        this.knex.raw(
          `DATE_FORMAT(reminderSentAt, '%Y-%m-%dT%H:%i') as reminderSentAt`,
        ),
        "duration",
        "status",
        "service",
      )
      .where({ userId })
      .whereNull("reminderSentAt")
      .andWhereBetween("date", [
        this.knex.raw("NOW()"),
        this.knex.raw("DATE_ADD(NOW(), INTERVAL ? MINUTE)", [safeWindow]),
      ]);

    return result.map((row) => new Scheduling(row));
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    await this.knex(ETableNames.SCHEDULES).where({ id, userId }).del();
  }
}
