import { Diagnostic, DiagnosticDTO } from "../../../models/Diagnostic";
import { IDiagnosticRepository } from "../../../../../repositories/diagnostic/IDiagnosticRepository";
import { ApiError } from "../../../../../utils/ApiError";

export class SetDiagnosticUseCase {
    constructor(private DiagnosticRepository: IDiagnosticRepository) { }
    async execute(data: DiagnosticDTO, userId: string) {
        const { patientId, diagnostic, treatmentPlan } = new Diagnostic(data)
        const [diagnosticAlreadyExist] = await this.DiagnosticRepository.get(data.patientId, userId)

        if (!patientId || !diagnostic || !treatmentPlan) throw new ApiError('Deve ser informado o patientId, diagnostic e treatmentPlan')

        if (diagnosticAlreadyExist) {
            await this.DiagnosticRepository.update({
                patientId, diagnostic, treatmentPlan
            }, userId);
        }
        else {
            await this.DiagnosticRepository.save({
                patientId, diagnostic, treatmentPlan
            }, userId);
        }
        return Diagnostic
    }
}
