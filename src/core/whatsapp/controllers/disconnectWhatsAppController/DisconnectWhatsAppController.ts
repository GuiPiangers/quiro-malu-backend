import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DisconnectWhatsAppUseCase } from "../../useCases/disconnectWhatsApp/DisconnectWhatsAppUseCase";
import { ApiError } from "../../../../utils/ApiError";

export class DisconnectWhatsAppController {
  constructor(private disconnectWhatsAppUseCase: DisconnectWhatsAppUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if(!userId) {
        throw new ApiError("O usuário não foi encontrado", 404);
      }

      await this.disconnectWhatsAppUseCase.execute({ userId });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
