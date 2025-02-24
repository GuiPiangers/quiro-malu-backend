import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";

import {
  notificationObserver,
  NotificationObserverEvent,
} from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { ApiError } from "../../../../utils/ApiError";
import SendAppNotificationUseCase from "../../useCases/sendNotificationUseCase";

export class SendNotificationController {
  constructor(private sendNotificationUseCase: SendAppNotificationUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if (!userId) throw new ApiError("Acesso não autorizado", 401);

      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");

      const sendNotificationObserver: NotificationObserverEvent = async ({
        notification,
        totalNotRead,
      }) => {
        response.write(
          `data: ${JSON.stringify({ notification, totalNotRead })}\n\n`,
        );
      };
      notificationObserver.addObserver(userId, sendNotificationObserver);

      await this.sendNotificationUseCase.execute({ userId });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
