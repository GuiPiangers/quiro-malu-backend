import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";
import { notificationFactory, notificationTypes } from "../../models/NotificationFactory";

export default class SaveSendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute<T extends notificationTypes>({
    userId,
    ...data
  }: Parameters<typeof notificationFactory<T>>[1] & { userId: string }) {
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
