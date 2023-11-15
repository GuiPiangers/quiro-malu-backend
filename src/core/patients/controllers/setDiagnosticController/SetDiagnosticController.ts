import { SetDiagnosticUseCase } from "../../useCases/setDiagnostic/SetDiagnosticUseCase";
import { Request, Response } from "express";
import { DiagnosticDTO } from "../../models/Diagnostic";

export class SetDiagnosticController {
    constructor(private setDiagnosticUseCase: SetDiagnosticUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as DiagnosticDTO
            const userId = request.user.id

            await this.setDiagnosticUseCase.execute(data, userId!)
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