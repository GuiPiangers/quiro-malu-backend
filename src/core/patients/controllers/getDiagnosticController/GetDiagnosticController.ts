import { Request, Response } from "express";
import { GetDiagnosticUseCase } from "../../useCases/diagnostic/getDiagnostic/GetDiagnosticUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class GetDiagnosticController {
    constructor(private listDiagnosticUseCase: GetDiagnosticUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { patientId } = request.params
            const { diagnostic, treatmentPlan } = await this.listDiagnosticUseCase.execute(patientId, userId!)

            response.json({ diagnostic, treatmentPlan, patientId })
        }
        catch (err: any) {
            responseError(response, err)
        }
    }

}