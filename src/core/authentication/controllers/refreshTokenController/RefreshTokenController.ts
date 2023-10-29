import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";

export class RefreshTokenController {
    constructor(private refreshTokenUseCase: RefreshTokenUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { refreshTokenId } = request.body
            const token = await this.refreshTokenUseCase.execute(refreshTokenId)
            return response.json(token)
        } catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}