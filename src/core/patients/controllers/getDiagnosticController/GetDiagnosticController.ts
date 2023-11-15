import { Request, Response } from "express";
import { GetDiagnosticUseCase } from "../../useCases/getDiagnostic/GetDiagnosticUseCase";

export class GetDiagnosticController {
    constructor(private listDiagnosticUseCase: GetDiagnosticUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { patientId } = request.params
            console.log(patientId)
            const { diagnostic, treatmentPlan } = await this.listDiagnosticUseCase.execute(patientId, userId!)

            response.json({ diagnostic, treatmentPlan, patientId })
        }
        catch (err: any) {
            const statusCode = err.statusCode ?? 500
            response.status(statusCode).json({
                message: err.message || 'Unexpected error.',
                statusCode: err.statusCode ?? 500,
                type: err.type,
            })
        }
    }

}