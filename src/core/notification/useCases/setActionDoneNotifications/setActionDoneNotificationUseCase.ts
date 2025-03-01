import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";
import { notificationObserver } from "../../../shared/observers/NotificationObserver/NotificationObserver";

export class SetActionDoneNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ id, userId }: { userId: string; id: string }) {
    await this.notificationRepository.update({
      id,
      userId,
      actionNeeded: false,
    });

    const totalNotRead =
      await this.notificationRepository.countNotReadOrNeedAct({ userId });

    notificationObserver.notify(userId, { totalNotRead });
  }
}
