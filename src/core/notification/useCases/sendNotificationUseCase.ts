import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification } from "../models/Notification";

export default class SendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    userId,
    notification,
  }: {
    notification?: Notification;
    userId: string;
  }) {
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });
    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
