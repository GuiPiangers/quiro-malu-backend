import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { NotificationDTO } from "../../models/Notification";
import { notificationFactory } from "../../models/NotificationFactory";

export default class SaveSendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId, ...data }: NotificationDTO & { userId: string }) {
    const notification = notificationFactory(data.type, data);
    const notificationDTO = notification.getDTO();

    await this.notificationRepository.save({ ...notificationDTO, userId });
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({
        userId,
      });

    notificationObserver.notify(userId, { notification, totalNotRead });
  }
}
