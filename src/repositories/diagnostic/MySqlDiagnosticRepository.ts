import { query } from "../../database/mySqlConnection";
import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";

export class MySqlDiagnosticRepository implements IDiagnosticRepository {
  save({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
    const sql = "INSERT INTO diagnostics SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...data,
      userId,
      patientId,
    });
  }

  update({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
    const sql = "UPDATE diagnostics SET ? WHERE patientId = ? and userId = ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, [data, patientId, userId]);
  }

  get(patientId: string, userId: string): Promise<DiagnosticDTO[]> {
    const sql = "SELECT * FROM diagnostics WHERE patientId = ? and userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;

    return query(errorMessage, sql, [patientId, userId]);
  }
}
