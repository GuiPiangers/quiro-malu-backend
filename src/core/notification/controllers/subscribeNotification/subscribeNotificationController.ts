import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { SubscribeNotificationUseCase } from "../../useCases/subscribeNotification/subscribeNotificationUseCase";
import { Subscription } from "../../../../repositories/notification/IPushNotificationProvider";

export class SubscribeNotificationController {
  constructor(
    private subscribeNotificationUseCase: SubscribeNotificationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const subscription = request.body as Subscription;

      if (!userId) throw new ApiError("O id deve ser informado", 401);
      if (!subscription)
        throw new ApiError("A subscription ser informada", 401);

      await this.subscribeNotificationUseCase.execute({ userId, subscription });

      response.send({
        message: "Inscrição para receber notificações feita com sucesso!",
      });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
