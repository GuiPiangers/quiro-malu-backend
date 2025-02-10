import { PushSubscription } from "web-push";
import { NotificationDTO } from "../../core/notification/models/Notification";

export type Subscription = PushSubscription;

export interface IPushNotificationProvider {
  send(subscription: Subscription, payload: NotificationDTO): Promise<void>;
  subscribe(subscription: Subscription): Promise<void>;
  unsubscribe(data: {
    userId: string;
    subscription: Subscription;
  }): Promise<void>;
  getSubscriptions(data: { userId: string }): Promise<Subscription[]>;
}
