import { Request, Response } from "express";
import { GetAnamnesisUseCase } from "../../useCases/getAnamnesis/GetAnamnesisUseCase";

export class GetAnamnesisController {
    constructor(private listAnamnesisUseCase: GetAnamnesisUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { patientId } = request.params
            const { patientId: _, ...AnamnesisData } = await this.listAnamnesisUseCase.execute(patientId, userId!)

            response.json({ patientId, ...AnamnesisData })
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