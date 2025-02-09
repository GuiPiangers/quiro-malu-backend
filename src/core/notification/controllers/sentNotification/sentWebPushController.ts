import { Request, Response } from "express";
import { NotificationDTO } from "../../models/Notification";
import { responseError } from "../../../../utils/ResponseError";
import {
  notificationObserver,
  NotificationObserverEvent,
} from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { PushSubscription } from "web-push";
import PushNotifications from "node-pushnotifications";

const publicVapidKey = process.env.VAPID_PUBLIC_KEY!;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY!;

export class SentWebPushController {
  async handle(request: Request, response: Response) {
    try {
      const subscription = request.body as PushSubscription;

      const sentNotificationObserver: NotificationObserverEvent = async ({
        title,
        message,
      }: NotificationDTO) => {
        const settings: PushNotifications.Settings = {
          web: {
            vapidDetails: {
              subject: "mailto: <jeffeverhart383@gmail.com>", // REPLACE_WITH_YOUR_EMAIL
              publicKey: publicVapidKey,
              privateKey: privateVapidKey,
            },
            gcmAPIKey: "gcmkey",
            TTL: 2419200,
            contentEncoding: "aes128gcm",
            headers: {},
          },
          isAlwaysUseFCM: false,
        };

        const push = new PushNotifications(settings);

        const payload = { title: "zsdfsa sadawsd", body: "asdasd" };
        push.send(subscription, payload, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("chegou aqui");
            console.log(result);
          }
        });
      };

      notificationObserver.addObserver(sentNotificationObserver);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
