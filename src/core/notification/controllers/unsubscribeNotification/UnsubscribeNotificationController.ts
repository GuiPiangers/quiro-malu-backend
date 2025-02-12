import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { UnsubscribeNotificationUseCase } from "../../useCases/unsubscribeNotification/unsubscribeNotificationUseCase";

export class UnsubscribeNotificationController {
  constructor(
    private unsubscribeNotificationUseCase: UnsubscribeNotificationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      await this.unsubscribeNotificationUseCase.execute({
        userId,
      });

      response.send({
        message: "Desinserção para receber notificações feita com sucesso!",
      });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
