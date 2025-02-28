import { IPushNotificationProvider } from "../../../../repositories/notification/IPushNotificationProvider";
import {
  PushNotification,
  PushNotificationDTO,
} from "../../models/PushNotification";

export class SendPushNotificationUseCase {
  constructor(private pushNotificationProvider: IPushNotificationProvider) {}

  async execute({
    notificationData,
    userId,
  }: {
    userId: string;
    notificationData: PushNotificationDTO;
  }) {
    try {
      const notification = new PushNotification(notificationData);
      const notificationDTO = notification.getDTO();

      const { subscriptions } =
        (await this.pushNotificationProvider.getAllowedSubscriptions({
          userId,
        })) || {};

      if (!subscriptions) {
        return;
      }

      subscriptions.map((subscription) =>
        this.pushNotificationProvider.send(subscription, notificationDTO),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
