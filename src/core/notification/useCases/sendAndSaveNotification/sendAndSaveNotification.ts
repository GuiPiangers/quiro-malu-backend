import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { Notification, NotificationDTO } from "../../models/Notification";

export default class SaveSendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId, ...data }: NotificationDTO & { userId: string }) {
    const notification = new Notification(data);
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });

    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
