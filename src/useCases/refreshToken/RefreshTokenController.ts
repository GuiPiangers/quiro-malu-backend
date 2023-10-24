import { Request, Response } from "express";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
    constructor(private refreshTokenUseCase: RefreshTokenUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { refreshTokenId } = request.body
            const token = await this.refreshTokenUseCase.execute(refreshTokenId)
            return response.json(token)
        } catch (err) {
            return response.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}