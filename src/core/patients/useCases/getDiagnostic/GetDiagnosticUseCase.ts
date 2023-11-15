import { IDiagnosticRepository } from "../../../../repositories/diagnostic/IDiagnosticRepository";

export class GetDiagnosticUseCase {
    constructor(
        private diagnosticRepository: IDiagnosticRepository
    ) { }

    async execute(patientId: string, userId: string) {
        const [diagnosticData] = await this.diagnosticRepository.get(patientId, userId)

        return diagnosticData
    }
}