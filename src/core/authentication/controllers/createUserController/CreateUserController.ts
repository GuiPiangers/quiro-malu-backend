import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase"
import { Request, Response } from "express"

export class CreateUserController {
    constructor(private createUserUseCase: CreateUserUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { name, password, email, phone } = request.body
            await this.createUserUseCase.execute({ name, password, email, phone })
            response.status(201).send("Criado com sucesso!")
        }
        catch (err: any) {
            const statusCode = err.statusCode ?? 500
            return response.status(statusCode).json({
                message: err.message || 'Unexpected error.'
            })
        }
    }
}