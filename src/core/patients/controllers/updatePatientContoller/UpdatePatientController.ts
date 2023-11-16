import { Request, Response } from "express";
import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { Patient, PatientDTO } from "../../models/Patient";
import { responseError } from "../../../../utils/ResponseError";

export class UpdatePatientController {
    constructor(private updatePatientUseCase: UpdatePatientUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const patientData = request.body as PatientDTO
            const patient = new Patient(patientData)
            const patientDTO = patient.getPatientDTO()

            await this.updatePatientUseCase.execute(patientDTO, userId!)
            response.status(201).json({ message: 'Atualizado com sucesso!' })
        }
        catch (err: any) {
            responseError(response, err)
        }
    }
}