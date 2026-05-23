import { DiagnosticDTO } from '../../core/patients/models/Diagnostic'

export interface IDiagnosticRepository {
  save(data: DiagnosticDTO, clinicId: string): Promise<void>;
  saveMany(data: (DiagnosticDTO & { clinicId: string })[]): Promise<void>;
  update(data: DiagnosticDTO, clinicId: string): Promise<void>;
  get(patientId: string, clinicId: string): Promise<DiagnosticDTO>;
}
