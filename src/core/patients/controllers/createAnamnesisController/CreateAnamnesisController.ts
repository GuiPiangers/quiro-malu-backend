import { CreateAnamnesisUseCase } from "../../useCases/createAnamnesis/CreateAnamnesisUseCase";
import { Request, Response } from "express";
import { AnamnesisDTO } from "../../models/Anamnesis";

export class CreateAnamnesisController {
    constructor(private createAnamnesisUseCase: CreateAnamnesisUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as AnamnesisDTO
            const userId = request.user.id

            await this.createAnamnesisUseCase.execute(data, userId!)
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