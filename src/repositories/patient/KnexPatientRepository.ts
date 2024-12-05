import { Patient, PatientDTO } from "../../core/patients/models/Patient";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { order, query } from "../../database/mySqlConnection";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import { ApiError } from "../../utils/ApiError";
import { getValidObjectValues } from "../../utils/getValidObjectValues";

export class KnexPatientRepository implements IPatientRepository {
  async save(data: PatientDTO, userId: string): Promise<void> {
    try {
      const result = await Knex(ETableNames.PATIENTS).insert({
        ...data,
        userId,
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async saveMany(data: (PatientDTO & { userId: string })[]): Promise<void> {
    try {
      const result = await Knex(ETableNames.PATIENTS).insert(data);
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
      const result = await Knex(ETableNames.PATIENTS)
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
    const orderBy = config.orderBy?.map(({ field, orientation }) =>
      order({ field, orientation }),
    );
    const sql = `SELECT * FROM patients WHERE userId = ? AND name like ? ORDER BY ${orderBy}  LIMIT ? OFFSET ?`;
    const errorMessage = `Não foi possível realizar a busca`;
    const results = await query<PatientDTO[]>(errorMessage, sql, [
      userId,
      `%${config.search?.name}%`,
      config.limit,
      config.offSet,
    ]);

    return results.map((result) =>
      new Patient(getValidObjectValues<PatientDTO>(result)).getPatientDTO(),
    );
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

  async getById(patientId: string, userId: string): Promise<PatientDTO[]> {
    const sql =
      "SELECT *, created_at AS createAt FROM patients WHERE id = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    const [result] = await query<PatientDTO[]>(errorMessage, sql, [
      patientId,
      userId,
    ]);

    return [
      new Patient(getValidObjectValues<PatientDTO>(result)).getPatientDTO(),
    ];
  }

  async delete(patientId: string, userId: string): Promise<void> {
    try {
      await Knex(ETableNames.PATIENTS).where({ id: patientId, userId }).del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
