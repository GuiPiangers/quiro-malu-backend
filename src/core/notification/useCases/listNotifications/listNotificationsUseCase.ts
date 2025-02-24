import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";

export default class ListNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId }: { userId: string }) {
    const notifications = await this.notificationRepository.list({ userId });

    return notifications;
  }
}
