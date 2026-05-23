import { PatientDTO } from '../../core/patients/models/Patient'
import { ETableNames } from '../../database/ETableNames'
import { IPatientRepository } from '../../repositories/patient/IPatientRepository'
import { ApiError } from '../../utils/ApiError'
import type { Knex } from 'knex'

const SIMPLE_IDENTIFIER_REGEX =
  /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/

function normalizeOrientation(orientation: string) {
  return `${orientation}`.toUpperCase() === 'DESC'
    ? 'DESC'
    : 'ASC'
}

export class KnexPatientRepository implements IPatientRepository {
  constructor(private readonly knex: Knex) {}

  async getByBirthMonthAndDay({
    birthMonth,
    birthDay,
    clinicId,
  }: {
    birthMonth: number;
    birthDay: number;
    clinicId?: string;
  }) {
    if (
      !Number.isInteger(birthMonth) ||
      birthMonth < 1 ||
      birthMonth > 12 ||
      !Number.isInteger(birthDay) ||
      birthDay < 1 ||
      birthDay > 31
    ) {
      throw new ApiError('birthMonth e birthDay inválidos', 400, 'birthMonth')
    }

    try {
      let q = this.knex(ETableNames.PATIENTS)
        .select('*')
        .whereNotNull('dateOfBirth')
        .whereRaw('MONTH(dateOfBirth) = ? AND DAY(dateOfBirth) = ?', [
          birthMonth,
          birthDay,
        ])

      if (clinicId) {
        q = q.andWhere({ clinicId })
      }

      return await q
    } catch (error: any) {
      if (error instanceof ApiError) throw error
      throw new ApiError(error.message, 500)
    }
  }

  async save(data: PatientDTO, clinicId: string): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS).insert({
        ...data,
        clinicId,
      })
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async saveMany(data: (PatientDTO & { clinicId: string })[]): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS).insert(
        data.map(({ clinicId, ...patient }) => ({
          ...patient,
          clinicId,
        })),
      )
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async update(
    data: PatientDTO,
    patientId: string,
    clinicId: string,
  ): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS)
        .update(data)
        .where({ id: patientId, clinicId })
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async getAll(
    clinicId: string,
    config: {
      limit: number;
      offSet: number;
      search?: { name?: string };
      orderBy?: { field: string; orientation: 'ASC' | 'DESC' }[];
    },
  ): Promise<PatientDTO[]> {
    const query = this.knex(ETableNames.PATIENTS)
      .select('*')
      .where({ clinicId })
      .andWhere('name', 'like', `%${config?.search?.name ?? ''}%`)

    const orderBy = config.orderBy?.length
      ? config.orderBy
      : ([{ field: 'updated_at', orientation: 'DESC' }] as const)

    orderBy.forEach(({ field, orientation }) => {
      const direction = normalizeOrientation(orientation)
      const normalizedField = `${field}`.replace(/[\\]/g, '').trim()

      if (SIMPLE_IDENTIFIER_REGEX.test(normalizedField)) {
        query.orderBy(normalizedField, direction.toLowerCase() as any)
        return
      }

      const match = normalizedField.match(/^\(name like "(.*)%"\)$/)

      if (match) {
        const prefix = match[1]
        query.orderByRaw(`(name like ?) ${direction}`, [`${prefix}%`])
        return
      }

      throw new ApiError('Invalid orderBy field', 400)
    })

    if (config.limit !== undefined && config.offSet !== undefined) {
      return await query.limit(config.limit).offset(config.offSet)
    }

    return await query
  }

  async countAll(
    clinicId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]> {
    try {
      const [result] = await this.knex(ETableNames.PATIENTS)
        .count('id as total')
        .where({ clinicId })
        .andWhere('name', 'like', `%${search?.name}%`)

      return [result] as [{ total: number }]
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async getByCpf(cpf: string, clinicId: string): Promise<PatientDTO[]> {
    try {
      const result = await this.knex(ETableNames.PATIENTS)
        .select('*')
        .where({ cpf, clinicId })

      return result
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async getByHash(hashData: string, clinicId: string): Promise<PatientDTO> {
    try {
      const result = await this.knex(ETableNames.PATIENTS)
        .first('*')
        .where({ hashData, clinicId })

      return result
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async getMostRecent(clinicId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100)

    return await this.knex(ETableNames.PATIENTS)
      .select('*')
      .where({ clinicId })
      .orderBy('created_at', 'desc')
      .limit(safeLimit)
  }

  async listPatientsById(data: {
    clinicId: string;
    patientIds: string[];
  }): Promise<PatientDTO[]> {
    if (data.patientIds.length === 0) {
      return []
    }

    const rows = await this.knex(ETableNames.PATIENTS)
      .select('*')
      .where({ clinicId: data.clinicId })
      .whereIn('id', data.patientIds)

    const orderIndex = new Map(
      data.patientIds.map((id, index) => [id, index]),
    )

    return (rows as PatientDTO[]).sort((a, b) => {
      const ia = a.id !== undefined
        ? orderIndex.get(a.id) ?? 0
        : 0
      const ib = b.id !== undefined
        ? orderIndex.get(b.id) ?? 0
        : 0
      return ia - ib
    })
  }

  async countPatientsOwnedByUser(data: {
    clinicId: string;
    patientIds: string[];
  }): Promise<number> {
    if (data.patientIds.length === 0) {
      return 0
    }

    try {
      const [row] = await this.knex(ETableNames.PATIENTS)
        .where({ clinicId: data.clinicId })
        .whereIn('id', data.patientIds)
        .count('id as total')

      const n = Number((row as { total?: number | string })?.total ?? 0)
      return Number.isFinite(n)
        ? n
        : 0
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }

  async getById(patientId: string, clinicId: string): Promise<PatientDTO[]> {
    const result: PatientDTO = await this.knex(ETableNames.PATIENTS)
      .first('*', 'created_at AS createAt')
      .where({ id: patientId, clinicId })

    return [result]
  }

  async delete(patientId: string, clinicId: string): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS)
        .where({ id: patientId, clinicId })
        .del()
    } catch (error: any) {
      throw new ApiError(error.message, 500)
    }
  }
}
