import { responseError } from "../../../../utils/ResponseError";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { Request, Response } from "express";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { name, password, email, phone } = request.body;
      await this.createUserUseCase.execute({ name, password, email, phone });
      response.status(201).json({ name, password, email, phone });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
