import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { Request, Response } from "express";
import { PatientDTO } from "../../models/Patient";

export class CreatePatientController {
    constructor(private createPatientUseCase: CreatePatientUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as PatientDTO
            const userId = request.user.id

            await this.createPatientUseCase.execute(data, userId!)
            response.status(201).json({ message: "Criado com sucesso!" })
        }
        catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.',
                statusCode: err.statusCode ?? 500,
                type: err.type,
            })
        }
    }
}