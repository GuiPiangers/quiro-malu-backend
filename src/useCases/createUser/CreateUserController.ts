import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
    constructor(private createUserUseCase: CreateUserUseCase) { }

    async handle(request: Request, response: Response) {
        try {
            const { name, password, email, phone } = request.body
            await this.createUserUseCase.execute({ name, password, email, phone })
            response.status(201).send("Criado com sucesso!")
        }
        catch (err) {
            response.status(400).json({ message: err.message })

        }
    }
}