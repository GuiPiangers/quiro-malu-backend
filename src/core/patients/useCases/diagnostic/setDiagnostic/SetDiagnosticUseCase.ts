import { Diagnostic, DiagnosticDTO } from '../../../models/Diagnostic'
import { IDiagnosticRepository } from '../../../../../repositories/diagnostic/IDiagnosticRepository'

export class SetDiagnosticUseCase {
  constructor(private DiagnosticRepository: IDiagnosticRepository) {}
  async execute(data: DiagnosticDTO, clinicId: string) {
    const { patientId, diagnostic, treatmentPlan } = new Diagnostic(data)

    const diagnosticAlreadyExist = await this.DiagnosticRepository.get(
      data.patientId,
      clinicId,
    )

    if (diagnosticAlreadyExist) {
      await this.DiagnosticRepository.update(
        {
          patientId,
          diagnostic,
          treatmentPlan,
        },
        clinicId,
      )
    } else {
      await this.DiagnosticRepository.save(
        {
          patientId,
          diagnostic,
          treatmentPlan,
        },
        clinicId,
      )
    }
    return Diagnostic
  }
}
