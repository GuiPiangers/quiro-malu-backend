import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";

export interface IDiagnosticRepository {
  save(data: DiagnosticDTO, userId: string): Promise<void>;
  update(data: DiagnosticDTO, userId: string): Promise<void>;
  get(patientId: string, userId: string): Promise<DiagnosticDTO[]>;
}
