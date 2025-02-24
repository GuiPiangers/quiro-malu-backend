import { Request, Response } from "express";
import { NotificationDTO } from "../../models/Notification";
import { responseError } from "../../../../utils/ResponseError";

import {
  notificationObserver,
  NotificationObserverEvent,
} from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { ApiError } from "../../../../utils/ApiError";

export class SendNotificationController {
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
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
