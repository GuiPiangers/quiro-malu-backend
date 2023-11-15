import { Request, Response } from "express";
import { GetAnamnesisUseCase } from "../../useCases/getAnamnesis/GetAnamnesisUseCase";

export class GetAnamnesisController {
    constructor(private listAnamnesisUseCase: GetAnamnesisUseCase) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { patientId } = request.params
            console.log(patientId)
            const AnamnesisData = await this.listAnamnesisUseCase.execute(patientId, userId!)

            response.json(AnamnesisData)
        }
        catch (err: any) {
            const statusCode = err.statusCode ?? 500
            response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }

}