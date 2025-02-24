import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import ListNotificationsUseCase from "../../useCases/listNotifications/listNotificationsUseCase";

export class ListNotificationsController {
  constructor(private listNotificationsUseCase: ListNotificationsUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      const notifications = await this.listNotificationsUseCase.execute({
        userId,
      });

      response.send(notifications);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
