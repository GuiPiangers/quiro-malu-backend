import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { SetReadNotificationsUseCase } from "../../useCases/setReadNotifications/setReadNotificationUseCase";

export class SetReadNotificationsController {
  constructor(
    private setReadNotificationsUseCase: SetReadNotificationsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const notificationsId = request.body as { id: string }[];

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      await this.setReadNotificationsUseCase.execute({
        userId,
        notificationsId,
      });

      response.send({ message: "Notificações marcadas como lidas!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
