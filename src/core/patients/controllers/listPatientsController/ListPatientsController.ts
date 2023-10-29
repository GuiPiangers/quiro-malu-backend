import { Request, Response } from "express";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";

export class ListPatientsController {
    constructor(private listPatientsUseCase: ListPatientsUseCase) { }
    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const patients = await this.listPatientsUseCase.execute(userId!)

            response.json(patients)
        } catch (err: any) {
            const statusCode = err.statusCode ?? 500
            response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

}