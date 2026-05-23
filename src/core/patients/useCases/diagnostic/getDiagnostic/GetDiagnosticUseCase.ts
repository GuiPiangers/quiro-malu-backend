import { IDiagnosticRepository } from '../../../../../repositories/diagnostic/IDiagnosticRepository'

export class GetDiagnosticUseCase {
  constructor(private diagnosticRepository: IDiagnosticRepository) {}

  async execute(patientId: string, clinicId: string) {
    const diagnosticData = await this.diagnosticRepository.get(
      patientId,
      clinicId,
    )

    return diagnosticData ?? {}
  }
}
