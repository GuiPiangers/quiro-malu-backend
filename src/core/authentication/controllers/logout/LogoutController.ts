import { Request, Response } from "express";
import { LogoutUseCase } from "../../useCases/logout/logoutUseCase";

export class LogoutController {
    constructor(private logoutUseCase: LogoutUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { refreshTokenId } = request.body
            await this.logoutUseCase.execute(refreshTokenId)
            return response.json({ message: 'deslogado com sucesso' })
        } catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}