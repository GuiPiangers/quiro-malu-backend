import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification, NotificationDTO } from "../models/Notification";

export default class AddNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId, ...data }: NotificationDTO & { userId: string }) {
    const notification = new Notification(data);
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
    const totalNotRead = await this.notificationRepository.countNotRead({
      userId,
    });

    notificationObserver.notify(notification, totalNotRead);
  }
}
