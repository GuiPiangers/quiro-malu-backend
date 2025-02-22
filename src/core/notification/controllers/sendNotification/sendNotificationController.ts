import { Request, Response } from "express";
import { NotificationDTO } from "../../models/Notification";
import { responseError } from "../../../../utils/ResponseError";

import {
  notificationObserver,
  NotificationObserverEvent,
} from "../../../shared/observers/NotificationObserver/NotificationObserver";

export class SendNotificationController {
  async handle(request: Request, response: Response) {
    try {
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");

      const sendNotificationObserver: NotificationObserverEvent = async (
        notification: NotificationDTO,
        totalNotRead: number,
      ) => {
        response.write(
          `data: ${JSON.stringify({ notification, totalNotRead })}\n\n`,
        );
      };
      notificationObserver.addObserver(sendNotificationObserver);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
