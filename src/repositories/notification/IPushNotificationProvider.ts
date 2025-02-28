import { PushSubscription } from "web-push";
import { NotificationDTO } from "../../core/notification/models/Notification";
import { PushNotificationDTO } from "../../core/notification/models/PushNotification";

export type Subscription = PushSubscription;

export type SubscribeParams = {
  userId: string;
  allowPushNotifications: boolean;
  subscription: Subscription;
};

export type UnsubscribeParams = {
  userId: string;
};

export type GetSubscriptionsParams = {
  userId: string;
};

export interface IPushNotificationProvider {
  send(subscription: Subscription, payload: PushNotificationDTO): Promise<void>;
  subscribe(data: SubscribeParams): Promise<void>;
  updateSubscription(data: SubscribeParams): Promise<void>;
  unsubscribe(data: UnsubscribeParams): Promise<void>;
  getAllowedSubscriptions(
    data: GetSubscriptionsParams,
  ): Promise<{ userId: string; subscriptions: Subscription[] } | null>;
}
