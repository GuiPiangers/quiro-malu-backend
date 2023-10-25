import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";
import { IController } from "../IController";

export class RefreshTokenController implements IController {
    constructor(private refreshTokenUseCase: RefreshTokenUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const userId = request.user.id
            const { refreshTokenId } = request.body
            const token = await this.refreshTokenUseCase.execute(refreshTokenId, userId)
            return response.json(token)
        } catch (err: any) {
            return response.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}