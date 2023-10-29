import { Request, Response } from "express";
import { LoginUserUseCase } from "../..//useCases/loginUser/LoginUserUseCase";

export class LoginUserController {
    constructor(private loginUserUseCase: LoginUserUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body
            const { token, refreshToken, user } = await this.loginUserUseCase.execute(email, password)

            return response.json({ token, refreshToken, user }).status(200)
        } catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}