import { PatientDTO } from "../../core/patients/models/Patient";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import { ApiError } from "../../utils/ApiError";

const SIMPLE_IDENTIFIER_REGEX =
  /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function normalizeOrientation(orientation: string) {
  return `${orientation}`.toUpperCase() === "DESC" ? "DESC" : "ASC";
}

export class KnexPatientRepository implements IPatientRepository {
  async getByDateOfBirth({ dateOfBirth }: { dateOfBirth: string }) {
    try {
      const result = await Knex(ETableNames.PATIENTS)
        .select("*")
        .where({ dateOfBirth });

      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async save(data: PatientDTO, userId: string): Promise<void> {
    try {
      await Knex(ETableNames.PATIENTS).insert({
        ...data,
        userId,
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async saveMany(data: (PatientDTO & { userId: string })[]): Promise<void> {
    try {
      await Knex(ETableNames.PATIENTS).insert(data);
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
      await Knex(ETableNames.PATIENTS)
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
    const query = Knex(ETableNames.PATIENTS)
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
      const [result] = await Knex(ETableNames.PATIENTS)
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
      const result = await Knex(ETableNames.PATIENTS)
        .select("*")
        .where({ cpf, userId });

      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getByHash(hashData: string, userId: string): Promise<PatientDTO> {
    try {
      const result = await Knex(ETableNames.PATIENTS)
        .first("*")
        .where({ hashData, userId });

      return result;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getMostRecent(userId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100);

    return await Knex(ETableNames.PATIENTS)
      .select("*")
      .where({ userId })
      .orderBy("created_at", "desc")
      .limit(safeLimit);
  }

  async getMostFrequent(userId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100);

    const schedulesCountSubquery = Knex(ETableNames.SCHEDULES)
      .select("patientId")
      .count("id as qtd")
      .where({ userId })
      .groupBy("patientId")
      .as("s_count");

    return await Knex(`${ETableNames.PATIENTS} as p`)
      .join(schedulesCountSubquery, "p.id", "s_count.patientId")
      .select("p.*")
      .where("p.userId", userId)
      .orderBy("s_count.qtd", "desc")
      .limit(safeLimit);
  }

  async getById(patientId: string, userId: string): Promise<PatientDTO[]> {
    const result: PatientDTO = await Knex(ETableNames.PATIENTS)
      .first("*", "created_at AS createAt")
      .where({ id: patientId, userId });

    return [result];
  }

  async delete(patientId: string, userId: string): Promise<void> {
    try {
      await Knex(ETableNames.PATIENTS).where({ id: patientId, userId }).del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
