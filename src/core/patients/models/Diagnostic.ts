export interface DiagnosticDTO {
  patientId: string;
  diagnostic: string  ;
  treatmentPlan: string  ;
}

export class Diagnostic {
  readonly patientId: string  ;
  readonly diagnostic: string  ;
  readonly treatmentPlan: string  ;

  constructor({ patientId, diagnostic, treatmentPlan }: DiagnosticDTO) {
    this.patientId = patientId  ;
    this.diagnostic = diagnostic  ;
    this.treatmentPlan = treatmentPlan  ;
  }
}
