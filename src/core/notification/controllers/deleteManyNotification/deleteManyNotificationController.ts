import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import DeleteManyNotificationsUseCase from "../../useCases/deleteManyNotifications/deleteManyNotificationsUseCase";

export class DeleteManyNotificationsController {
  constructor(
    private listNotificationsUseCase: DeleteManyNotificationsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const { notificationsId } = request.body as { notificationsId: string[] };

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      const notifications = await this.listNotificationsUseCase.execute({
        userId,
        notificationsId,
      });

      response.send(notifications);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
