import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";

export class SetReadNotificationUseCase {
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
  }
}
