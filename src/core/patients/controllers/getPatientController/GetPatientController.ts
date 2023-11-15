import { Request, Response } from "express";
import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";

export class GetPatientController {
    constructor(private listPatientsUseCase: GetPatientUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { id: patientId } = request.params
            const patients = await this.listPatientsUseCase.execute(patientId, userId!)

            response.json(patients)
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