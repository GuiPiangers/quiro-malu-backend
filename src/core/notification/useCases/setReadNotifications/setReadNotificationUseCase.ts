import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";

export class SetReadNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    notificationsId,
    userId,
  }: {
    userId: string;
    notificationsId: { id: string }[];
  }) {
    const setNotificationsRead = notificationsId.map(({ id }) =>
      this.notificationRepository.update({ id, userId, read: true }),
    );

    await Promise.allSettled(setNotificationsRead);
    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({ userId });

    notificationObserver.notify(userId, { totalNotRead });
  }
}
