import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class RefreshTokenController {
    constructor(private refreshTokenUseCase: RefreshTokenUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { refreshTokenId } = request.body
            const token = await this.refreshTokenUseCase.execute(refreshTokenId)
            return response.json(token)
        } catch (err: any) {
            return responseError(response, err)
        }
    }
}