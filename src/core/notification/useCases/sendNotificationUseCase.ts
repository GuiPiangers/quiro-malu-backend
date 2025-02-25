import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification, NotificationDTO } from "../models/Notification";

export default class SendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    userId,
    notification: notificationDTO,
  }: {
    notification?: NotificationDTO;
    userId: string;
  }) {
    const notification = notificationDTO
      ? new Notification(notificationDTO)
      : undefined;
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });
    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
