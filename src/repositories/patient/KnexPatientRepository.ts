import { PatientDTO } from "../../core/patients/models/Patient";
import { ETableNames } from "../../database/ETableNames";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import { ApiError } from "../../utils/ApiError";
import type { Knex } from "knex";

const SIMPLE_IDENTIFIER_REGEX =
  /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function normalizeOrientation(orientation: string) {
  return `${orientation}`.toUpperCase() === "DESC" ? "DESC" : "ASC";
}

export class KnexPatientRepository implements IPatientRepository {
  constructor(private readonly knex: Knex) {}

  async getByBirthMonthAndDay({
    birthMonth,
    birthDay,
    userId,
  }: {
    birthMonth: number;
    birthDay: number;
    userId?: string;
  }) {
    if (
      !Number.isInteger(birthMonth) ||
      birthMonth < 1 ||
      birthMonth > 12 ||
      !Number.isInteger(birthDay) ||
      birthDay < 1 ||
      birthDay > 31
    ) {
      throw new ApiError("birthMonth e birthDay inválidos", 400, "birthMonth");
    }

    try {
      let q = this.knex(ETableNames.PATIENTS)
        .select("*")
        .whereNotNull("dateOfBirth")
        .whereRaw("MONTH(dateOfBirth) = ? AND DAY(dateOfBirth) = ?", [
          birthMonth,
          birthDay,
        ]);

      if (userId) {
        q = q.andWhere({ userId });
      }

      return await q;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }

  async save(data: PatientDTO, userId: string): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS).insert({
        ...data,
        userId,
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async saveMany(data: (PatientDTO & { userId: string })[]): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async update(
    data: PatientDTO,
    patientId: string,
    userId: string,
  ): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS)
        .update(data)
        .where({ id: patientId, userId });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getAll(
    userId: string,
    config: {
      limit: number;
      offSet: number;
      search?: { name?: string };
      orderBy?: { field: string; orientation: "ASC" | "DESC" }[];
    },
  ): Promise<PatientDTO[]> {
    const query = this.knex(ETableNames.PATIENTS)
      .select("*")
      .where({ userId })
      .andWhere("name", "like", `%${config?.search?.name ?? ""}%`);

    const orderBy = config.orderBy?.length
      ? config.orderBy
      : ([{ field: "updated_at", orientation: "DESC" }] as const);

    orderBy.forEach(({ field, orientation }) => {
      const direction = normalizeOrientation(orientation);
      const normalizedField = `${field}`.replace(/[\\]/g, "").trim();

      if (SIMPLE_IDENTIFIER_REGEX.test(normalizedField)) {
        query.orderBy(normalizedField, direction.toLowerCase() as any);
        return;
      }

      const match = normalizedField.match(/^\(name like "(.*)%"\)$/);

      if (match) {
        const prefix = match[1];
        query.orderByRaw(`(name like ?) ${direction}`, [`${prefix}%`]);
        return;
      }

      throw new ApiError("Invalid orderBy field", 400);
    });

    if (config.limit !== undefined && config.offSet !== undefined) {
      return await query.limit(config.limit).offset(config.offSet);
    }

    return await query;
  }

  async countAll(
    userId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]> {
    try {
      const [result] = await this.knex(ETableNames.PATIENTS)
        .count("id as total")
        .where({ userId })
        .andWhere("name", "like", `%${search?.name}%`);

      return [result] as [{ total: number }];
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getByCpf(cpf: string, userId: string): Promise<PatientDTO[]> {
    try {
      const result = await this.knex(ETableNames.PATIENTS)
        .select("*")
        .where({ cpf, userId });

      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getByHash(hashData: string, userId: string): Promise<PatientDTO> {
    try {
      const result = await this.knex(ETableNames.PATIENTS)
        .first("*")
        .where({ hashData, userId });

      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getMostRecent(userId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100);

    return await this.knex(ETableNames.PATIENTS)
      .select("*")
      .where({ userId })
      .orderBy("created_at", "desc")
      .limit(safeLimit);
  }

  async listPatientsById(data: {
    userId: string;
    patientIds: string[];
  }): Promise<PatientDTO[]> {
    if (data.patientIds.length === 0) {
      return [];
    }

    const rows = await this.knex(ETableNames.PATIENTS)
      .select("*")
      .where({ userId: data.userId })
      .whereIn("id", data.patientIds);

    const orderIndex = new Map(
      data.patientIds.map((id, index) => [id, index]),
    );

    return (rows as PatientDTO[]).sort((a, b) => {
      const ia = a.id !== undefined ? orderIndex.get(a.id) ?? 0 : 0;
      const ib = b.id !== undefined ? orderIndex.get(b.id) ?? 0 : 0;
      return ia - ib;
    });
  }

  async countPatientsOwnedByUser(data: {
    userId: string;
    patientIds: string[];
  }): Promise<number> {
    if (data.patientIds.length === 0) {
      return 0;
    }

    try {
      const [row] = await this.knex(ETableNames.PATIENTS)
        .where({ userId: data.userId })
        .whereIn("id", data.patientIds)
        .count("id as total");

      const n = Number((row as { total?: number | string })?.total ?? 0);
      return Number.isFinite(n) ? n : 0;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getById(patientId: string, userId: string): Promise<PatientDTO[]> {
    const result: PatientDTO = await this.knex(ETableNames.PATIENTS)
      .first("*", "created_at AS createAt")
      .where({ id: patientId, userId });

    return [result];
  }

  async delete(patientId: string, userId: string): Promise<void> {
    try {
      await this.knex(ETableNames.PATIENTS).where({ id: patientId, userId }).del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
