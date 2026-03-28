import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { RegisterWhatsAppUseCase } from "../../useCases/registerWhatsApp/RegisterWhatsAppUseCase";
import { ApiError } from "../../../../utils/ApiError";

export class RegisterWhatsAppController {
  constructor(private registerWhatsAppUseCase: RegisterWhatsAppUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if(!userId) {
        throw new ApiError("O usuário não foi encontrado", 404);
      }

      const result = await this.registerWhatsAppUseCase.execute({ userId });

      return response.status(201).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
