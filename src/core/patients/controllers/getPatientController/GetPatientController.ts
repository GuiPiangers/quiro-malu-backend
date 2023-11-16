import { Request, Response } from "express";
import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";
import { responseError } from "../../../../utils/ResponseError";

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
            responseError(response, err)
        }
    }

}