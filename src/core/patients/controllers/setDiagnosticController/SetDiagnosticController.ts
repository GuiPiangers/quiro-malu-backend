import { SetDiagnosticUseCase } from "../../useCases/diagnostic/setDiagnostic/SetDiagnosticUseCase";
import { Request, Response } from "express";
import { DiagnosticDTO } from "../../models/Diagnostic";
import { responseError } from "../../../../utils/ResponseError";

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
            return responseError(response, err)
        }
    }
}