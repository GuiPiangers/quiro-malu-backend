import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetWhatsAppStatusUseCase } from "../../useCases/getWhatsAppStatus/GetWhatsAppStatusUseCase";
import { ApiError } from "../../../../utils/ApiError";

export class GetWhatsAppStatusController {
  constructor(private getWhatsAppStatusUseCase: GetWhatsAppStatusUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if(!userId) {
        throw new ApiError("O usuário não foi encontrado", 404);
      }

      const result = await this.getWhatsAppStatusUseCase.execute({ userId });

      return response.status(200).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
