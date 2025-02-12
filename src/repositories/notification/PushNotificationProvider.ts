import { NotificationDTO } from "../../core/notification/models/Notification";
import { SubscriptionModel } from "../../database/mongoose/schemas/Sbuscription";
import {
  GetSubscriptionsParams,
  IPushNotificationProvider,
  SubscribeParams,
  Subscription,
  UnsubscribeParams,
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

    const payload = { title, body: message };
    push.send(subscription, payload, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  }

  async subscribe({ userId, subscription }: SubscribeParams): Promise<void> {
    await SubscriptionModel.findOneAndUpdate(
      { userId },
      { $push: { subscriptions: subscription } },
      { upsert: true, new: true },
    );
  }

  async unsubscribe({ userId }: UnsubscribeParams): Promise<void> {
    await SubscriptionModel.deleteOne({
      userId,
    });
  }

  async getSubscriptions({ userId }: GetSubscriptionsParams): Promise<{
    userId: string;
    subscriptions: Subscription[];
  } | null> {
    return await SubscriptionModel.findOne({ userId });
  }
}
