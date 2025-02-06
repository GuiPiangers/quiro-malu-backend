import { INotificationRepository } from "../../../repositories/notification/INotificationRepository";
import { Notification, NotificationDOT } from "../models/Notification";

export default class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId, ...data }: NotificationDOT & { userId: string }) {
    const notification = new Notification(data);
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
  }
}
