import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";

interface ProgressWithPainScaleRow {
  id: string;
  patientId: string;
  userId: string;
  service: string;
  actualProblem?: string;
  procedures?: string;
  schedulingId: string;
  date: string;

  painScaleId?: string;
  painLevel: number;
  description: string;
}
export class KnexProgressRepository implements IProgressRepository {
  async getByScheduling({
    patientId,
    schedulingId,
    userId,
  }: {
    schedulingId: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    const rows: ProgressWithPainScaleRow[] = await Knex(
      `${ETableNames.PROGRESS} as p`,
    )
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, "p.id", "ps.progressId")
      .column(
        "p.id",
        "p.patientId",
        "p.userId",
        "p.service",
        "p.actualProblem",
        "p.procedures",
        "p.schedulingId",
        "ps.id as painScaleId",
        "ps.painLevel",
        "ps.description",
        Knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        "p.schedulingId": schedulingId,
        "p.patientId": patientId,
        "p.userId": userId,
      });

    return this.groupProgressPainScales(rows);
  }

  async save({
    patientId,
    userId,
    painScales,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    await Knex.transaction(async (trx) => {
      const [progressId] = await trx(ETableNames.PROGRESS).insert(
        {
          ...data,
          userId,
          patientId,
        },
        ["id"],
      );

      if (progressId && painScales && painScales.length > 0) {
        const painScaleRows = painScales.map((ps) => ({
          id: ps.id,
          progressId: data.id,
          painLevel: ps.painLevel,
          description: ps.description,
        }));

        await trx(ETableNames.PAIN_SCALES).insert(painScaleRows);
      }
    });
  }

  async update({
    id,
    patientId,
    userId,
    painScales,
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
    const rows: ProgressWithPainScaleRow[] = await Knex(
      `${ETableNames.PROGRESS} as p`,
    )
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, "p.id", "ps.progressId")
      .column(
        "p.id",
        "p.patientId",
        "p.userId",
        "p.service",
        "p.actualProblem",
        "p.procedures",
        "p.schedulingId",
        "ps.id as painScaleId",
        "ps.painLevel",
        "ps.description",
        Knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        "p.id": id,
        "p.patientId": patientId,
        "p.userId": userId,
      });

    const result = this.groupProgressPainScales(rows);

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
    const query = Knex(`${ETableNames.PROGRESS} as p`)
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, "p.id", "ps.progressId")
      .column(
        "p.id",
        "p.patientId",
        "p.userId",
        "p.service",
        "p.actualProblem",
        "p.procedures",
        "p.schedulingId",
        "ps.id as painScaleId",
        "ps.painLevel",
        "ps.description",
        Knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        "p.patientId": patientId,
        "p.userId": userId,
      })
      .orderBy("date", "desc");

    if (config) {
      const resultWithFilter = await query
        .limit(config.limit)
        .offset(config.offSet);

      return this.groupProgressPainScales(resultWithFilter);
    }

    return this.groupProgressPainScales(await query);
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

  private groupProgressPainScales(rows: ProgressWithPainScaleRow[]) {
    return rows.reduce((acc, row) => {
      let progress = acc.find((p) => p.id === row.id);

      if (!progress) {
        progress = {
          id: row.id,
          patientId: row.patientId,
          service: row.service,
          actualProblem: row.actualProblem,
          procedures: row.procedures,
          schedulingId: row.schedulingId,
          date: row.date,
          painScales: [],
        };
        acc.push(progress);
      }

      if (row.painScaleId) {
        progress.painScales?.push({
          id: row.painScaleId,
          painLevel: row.painLevel,
          description: row.description,
        });
      }

      return acc;
    }, [] as ProgressDTO[]);
  }
}
