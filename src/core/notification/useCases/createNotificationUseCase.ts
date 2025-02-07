import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { Notification, NotificationDTO } from "../models/Notification";

export default class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId, ...data }: NotificationDTO & { userId: string }) {
    const notification = new Notification(data);
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
  }
}
