import { Request, Response } from "express";
import { NotificationDTO } from "../../models/Notification";
import { responseError } from "../../../../utils/ResponseError";
import AddNotificationUseCase from "../../useCases/addNotificationUseCase";
import {
  notificationObserver,
  NotificationObserverEvent,
} from "../../../shared/observers/NotificationObserver/NotificationObserver";

export class sentNotificationController {
  async handle(request: Request, response: Response) {
    try {
      response.set({
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
      });

      const sentNotificationObserver: NotificationObserverEvent = async (
        notification: NotificationDTO,
        totalNotRead: number,
      ) => {
        response.write(JSON.stringify({ notification, totalNotRead }));
      };

      notificationObserver.addObserver(sentNotificationObserver);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
