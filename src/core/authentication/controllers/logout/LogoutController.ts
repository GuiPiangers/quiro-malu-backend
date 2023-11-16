import { Request, Response } from "express";
import { LogoutUseCase } from "../../useCases/logout/logoutUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class LogoutController {
    constructor(private logoutUseCase: LogoutUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { refreshTokenId } = request.body
            await this.logoutUseCase.execute(refreshTokenId)
            return response.json({ message: 'deslogado com sucesso' })
        } catch (err: any) {
            return responseError(response, err)
        }
    }
}