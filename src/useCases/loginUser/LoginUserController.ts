import { Request, Response } from "express";
import { LoginUserUseCase } from "./LoginUserUseCase";

export class LoginUserController {
    constructor(private loginUserUseCase: LoginUserUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body
            const { token, refreshToken } = await this.loginUserUseCase.execute(email, password)

            return response.json({ isLogged: true, token, refreshToken }).status(200)
        } catch (err) {
            response.json({ message: err.message }).status(400)
        }
    }
}