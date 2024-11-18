import { PatientDTO } from "../../core/patients/models/Patient";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { order, query } from "../../database/mySqlConnection";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import { getValidObjectValues } from "../../utils/getValidObjectValues";

export class KnexPatientRepository implements IPatientRepository {
  save(data: PatientDTO, userId: string): Promise<void> {
    const sql = "INSERT INTO patients SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...getValidObjectValues<PatientDTO>(data),
      userId,
    });
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
      console.log(result);
    } catch (error) {
      console.log("mensagem de erro", error);
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
    return results.map((result) => getValidObjectValues<PatientDTO>(result));
  }

  countAll(
    userId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]> {
    const sql =
      "SELECT COUNT(id) AS total FROM patients WHERE userId = ? AND name like ?";
    const errorMessage = `Não foi possível realizar a busca`;
    return query(errorMessage, sql, [userId, `%${search?.name}%`]);
  }

  async getByCpf(cpf: string, userId: string): Promise<PatientDTO[]> {
    const sql = "SELECT * FROM patients WHERE cpf = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    const [result] = await query<PatientDTO[]>(errorMessage, sql, [
      cpf,
      userId,
    ]);

    return [getValidObjectValues<PatientDTO>(result)];
  }

  async getById(patientId: string, userId: string): Promise<PatientDTO[]> {
    const sql =
      "SELECT *, created_at AS createAt FROM patients WHERE id = ? AND userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    const [result] = await query<PatientDTO[]>(errorMessage, sql, [
      patientId,
      userId,
    ]);

    return [getValidObjectValues<PatientDTO>(result)];
  }

  delete(patientId: string, userId: string): Promise<void> {
    const sql = "DELETE FROM patients WHERE id = ? AND userId = ?";
    const errorMessage = `Não foi possível deletar o paciente`;

    return query(errorMessage, sql, [patientId, userId]);
  }
}
