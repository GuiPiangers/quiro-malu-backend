import { Request, Response } from "express";
import { DeletePatientUseCase } from "../../useCases/deletePatient/DeletePatientUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class DeletePatientsController {
    constructor(private deletePatientsUseCase: DeletePatientUseCase) { }
    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { id: patientId } = request.body
            await this.deletePatientsUseCase.execute(patientId, userId!)

            response.json({ message: 'Paciente deletado com sucesso!' })
        } catch (err: any) {
            responseError(response, err)
        }
    }

}