import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IController } from "../IController";
import { ListPatientsUseCase } from "@quiromalu/core/src/useCases/listPatients/ListPatientsUseCase";

export class ListPatientsController implements IController {
    constructor(private listPatientsUseCase: ListPatientsUseCase) { }
    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id

            const patients = await this.listPatientsUseCase.execute(userId)
            response.json(patients)
        } catch (err: any) {
            const statusCode = err.statusCode ?? 500
            response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

}