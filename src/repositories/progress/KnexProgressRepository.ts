import { ProgressDTO } from '../../core/patients/models/Progress'
import { IProgressRepository } from './IProgressRepository'
import { ETableNames } from '../../database/ETableNames'
import type { Knex } from 'knex'

interface ProgressWithPainScaleRow {
  id: string
  userId: string
  patientId: string
  clinicId: string
  service: string
  actualProblem?: string
  procedures?: string
  schedulingId: string
  date: string

  painScaleId?: string
  painLevel: number
  description: string
}
export class KnexProgressRepository implements IProgressRepository {
  constructor(private readonly knex: Knex) {}

  async getByScheduling({
    patientId,
    schedulingId,
    clinicId,
  }: {
    schedulingId: string
    patientId: string
    clinicId: string
  }): Promise<ProgressDTO[]> {
    const rows: ProgressWithPainScaleRow[] = await this.knex(
      `${ETableNames.PROGRESS} as p`,
    )
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, 'p.id', 'ps.progressId')
      .column(
        'p.id',
        'p.userId',
        'p.patientId',
        'p.clinicId',
        'p.service',
        'p.actualProblem',
        'p.procedures',
        'p.schedulingId',
        'ps.id as painScaleId',
        'ps.painLevel',
        'ps.description',
        this.knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        'p.schedulingId': schedulingId,
        'p.patientId': patientId,
        'p.clinicId': clinicId,
      })

    return this.groupProgressPainScales(rows)
  }

  async save({
    patientId,
    clinicId,
    painScales,
    ...data
  }: ProgressDTO & { clinicId: string }): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx(ETableNames.PROGRESS).insert(
        {
          ...data,
          clinicId,
          patientId,
        },
        ['id'],
      )

      if (data.id && painScales && painScales.length > 0) {
        const painScaleRows = painScales.map((ps) => ({
          id: ps.id,
          progressId: data.id,
          painLevel: ps.painLevel,
          description: ps.description,
        }))

        await trx(ETableNames.PAIN_SCALES).insert(painScaleRows)
      }
    })
  }

  async update({
    id,
    patientId,
    clinicId,
    painScales,
    ...data
  }: ProgressDTO & { clinicId: string }): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx(ETableNames.PROGRESS)
        .update(data)
        .where({ id, patientId, clinicId })

      if (painScales) {
        await trx(ETableNames.PAIN_SCALES).where({ progressId: id }).del()

        if (painScales.length > 0) {
          const painScaleRows = painScales.map((ps) => ({
            id: ps.id,
            progressId: id,
            painLevel: ps.painLevel,
            description: ps.description,
          }))

          await trx(ETableNames.PAIN_SCALES).insert(painScaleRows)
        }
      }
    })
  }

  async get({
    id,
    patientId,
    clinicId,
  }: {
    id: string
    patientId: string
    clinicId: string
  }): Promise<ProgressDTO[]> {
    const rows: ProgressWithPainScaleRow[] = await this.knex(
      `${ETableNames.PROGRESS} as p`,
    )
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, 'p.id', 'ps.progressId')
      .column(
        'p.id',
        'p.userId',
        'p.patientId',
        'p.clinicId',
        'p.service',
        'p.actualProblem',
        'p.procedures',
        'p.schedulingId',
        'ps.id as painScaleId',
        'ps.painLevel',
        'ps.description',
        this.knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        'p.id': id,
        'p.patientId': patientId,
        'p.clinicId': clinicId,
      })

    const result = this.groupProgressPainScales(rows)

    return result
  }

  async list({
    patientId,
    clinicId,
    config,
  }: {
    patientId: string
    clinicId: string
    config?: { limit: number; offSet: number }
  }): Promise<ProgressDTO[]> {
    const query = this.knex(`${ETableNames.PROGRESS} as p`)
      .leftJoin(`${ETableNames.PAIN_SCALES} as ps`, 'p.id', 'ps.progressId')
      .column(
        'p.id',
        'p.userId',
        'p.patientId',
        'p.clinicId',
        'p.service',
        'p.actualProblem',
        'p.procedures',
        'p.schedulingId',
        'ps.id as painScaleId',
        'ps.painLevel',
        'ps.description',
        this.knex.raw('DATE_FORMAT(p.date, "%Y-%m-%dT%H:%i") as date'),
      )
      .select()
      .where({
        'p.patientId': patientId,
        'p.clinicId': clinicId,
      })
      .orderBy('date', 'desc')

    if (config) {
      const resultWithFilter = await query
        .limit(config.limit)
        .offset(config.offSet)

      return this.groupProgressPainScales(resultWithFilter)
    }

    return this.groupProgressPainScales(await query)
  }

  async count({
    patientId,
    clinicId,
  }: {
    patientId: string
    clinicId: string
  }): Promise<[{ total: number }]> {
    const [result] = await this.knex(ETableNames.PROGRESS)
      .count('id as total')
      .where({ clinicId, patientId })

    return [result] as [{ total: number }]
  }

  async delete({
    id,
    patientId,
    clinicId,
  }: {
    id: string
    patientId: string
    clinicId: string
  }): Promise<void> {
    await this.knex(ETableNames.PROGRESS)
      .where({ id, patientId, clinicId })
      .del()
  }

  private groupProgressPainScales(rows: ProgressWithPainScaleRow[]) {
    return rows.reduce((acc, row) => {
      let progress = acc.find((p) => p.id === row.id)

      if (!progress) {
        progress = {
          id: row.id,
          userId: row.userId,
          patientId: row.patientId,
          service: row.service,
          actualProblem: row.actualProblem,
          procedures: row.procedures,
          schedulingId: row.schedulingId,
          date: row.date,
          painScales: [],
        }
        acc.push(progress)
      }

      if (row.painScaleId) {
        progress.painScales?.push({
          id: row.painScaleId,
          painLevel: row.painLevel,
          description: row.description,
        })
      }

      return acc
    }, [] as ProgressDTO[])
  }
}
