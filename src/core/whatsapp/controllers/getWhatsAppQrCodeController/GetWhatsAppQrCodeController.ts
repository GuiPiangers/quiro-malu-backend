import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetWhatsAppQrCodeUseCase } from "../../useCases/getWhatsAppQrCode/GetWhatsAppQrCodeUseCase";
import { ApiError } from "../../../../utils/ApiError";

export class GetWhatsAppQrCodeController {
  constructor(private getWhatsAppQrCodeUseCase: GetWhatsAppQrCodeUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if(!userId) {
        throw new ApiError("O usuário não foi encontrado", 404);
      }

      const result = await this.getWhatsAppQrCodeUseCase.execute({ userId });

      return response.status(200).json(result);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
