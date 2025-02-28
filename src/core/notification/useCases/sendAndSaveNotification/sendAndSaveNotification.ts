import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification } from "../../models/Notification";

export default class SaveSendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    userId,
    notification,
  }: {
    userId: string;
    notification: Notification;
  }) {
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });

    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
