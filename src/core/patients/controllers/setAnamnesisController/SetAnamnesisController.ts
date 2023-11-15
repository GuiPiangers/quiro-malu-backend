import { SetAnamnesisUseCase } from "../../useCases/setAnamnesis/SetAnamnesisUseCase";
import { Request, Response } from "express";
import { AnamnesisDTO } from "../../models/Anamnesis";

export class SetAnamnesisController {
    constructor(private setAnamnesisUseCase: SetAnamnesisUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as AnamnesisDTO
            const userId = request.user.id

            await this.setAnamnesisUseCase.execute(data, userId!)
            response.status(201).json({ message: "Criado com sucesso!" })
        }
        catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}