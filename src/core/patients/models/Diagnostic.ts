export interface DiagnosticDTO {
  patientId: string;
  diagnostic: string | null;
  treatmentPlan: string | null;
}

export class Diagnostic {
  readonly patientId: string | null;
  readonly diagnostic: string | null;
  readonly treatmentPlan: string | null;

  constructor({ patientId, diagnostic, treatmentPlan }: DiagnosticDTO) {
    this.patientId = patientId || null;
    this.diagnostic = diagnostic || null;
    this.treatmentPlan = treatmentPlan || null;
  }
}
