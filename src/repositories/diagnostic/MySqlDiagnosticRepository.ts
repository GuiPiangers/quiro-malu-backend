import { query } from "../../database/mySqlConnection";
import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";
import { getValidObjectValues } from "../../utils/getValidObjectValues";

export class MySqlDiagnosticRepository implements IDiagnosticRepository {
  save({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
    const sql = "INSERT INTO diagnostics SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...getValidObjectValues(data),
      userId,
      patientId,
    });
  }

  update({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
    const sql = "UPDATE diagnostics SET ? WHERE patientId = ? and userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [
      getValidObjectValues(data),
      patientId,
      userId,
    ]);
  }

  async get(patientId: string, userId: string): Promise<DiagnosticDTO[]> {
    const sql = "SELECT * FROM diagnostics WHERE patientId = ? and userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<DiagnosticDTO[]>(errorMessage, sql, [
      patientId,
      userId,
    ]);
    return result.map((diagnostic) =>
      getValidObjectValues<DiagnosticDTO>(diagnostic),
    );
  }
}
