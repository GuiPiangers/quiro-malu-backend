import { IPushNotificationProvider } from "../../../../repositories/notification/IPushNotificationProvider";
import { Notification, NotificationDTO } from "../../models/Notification";

export class SendPushNotificationUseCase {
  constructor(private pushNotificationProvider: IPushNotificationProvider) {}

  async execute({
    notificationData,
    userId,
  }: {
    userId: string;
    notificationData: NotificationDTO;
  }) {
    try {
      const notification = new Notification(notificationData);
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
