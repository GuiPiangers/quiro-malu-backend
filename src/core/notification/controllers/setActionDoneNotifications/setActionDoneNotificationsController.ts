import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { SetActionDoneNotificationUseCase } from "../../useCases/setActionDoneNotifications/setActionDoneNotificationUseCase";

export class SetActionDoneNotificationController {
  constructor(
    private setReadNotificationsUseCase: SetActionDoneNotificationUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const { id } = request.body as { id: string };

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      await this.setReadNotificationsUseCase.execute({
        userId,
        id,
      });

      response.send({ message: "Notificações marcadas como lidas!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
