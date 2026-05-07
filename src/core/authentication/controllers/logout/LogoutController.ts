import { Request, Response } from "express";
import { LogoutBodySchema } from "./logoutSchemas";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { LogoutUseCase } from "../../useCases/logout/logoutUseCase";

export class LogoutController {
  constructor(private logoutUseCase: LogoutUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(LogoutBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      await this.logoutUseCase.execute(parsed.data.refreshTokenId);
      return response.status(200).json({ message: "deslogado com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
