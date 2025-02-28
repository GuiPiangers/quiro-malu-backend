import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification, NotificationDTO } from "../models/Notification";
import { notificationFactory } from "../models/NotificationFactory";

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
      ? notificationFactory(notificationDTO.type, notificationDTO)
      : undefined;
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });
    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
