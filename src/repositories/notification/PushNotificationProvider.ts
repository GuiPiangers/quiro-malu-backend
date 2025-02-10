import { NotificationDTO } from "../../core/notification/models/Notification";
import {
  IPushNotificationProvider,
  Subscription,
} from "./IPushNotificationProvider";
import PushNotifications from "node-pushnotifications";

const publicVapidKey = process.env.VAPID_PUBLIC_KEY!;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY!;
const email = process.env.EMAIL!;

export class PushNotificationProvider implements IPushNotificationProvider {
  async send(
    subscription: Subscription,
    { message, title }: NotificationDTO,
  ): Promise<void> {
    const settings: PushNotifications.Settings = {
      web: {
        vapidDetails: {
          subject: `mailto:${email}`,
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

    const payload = { title: title, body: message };
    push.send(subscription, payload, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  }

  async subscribe(subscription: Subscription): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async unsubscribe(data: {
    userId: string;
    subscription: Subscription;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getSubscriptions(data: { userId: string }): Promise<Subscription[]> {
    throw new Error("Method not implemented.");
  }
}
