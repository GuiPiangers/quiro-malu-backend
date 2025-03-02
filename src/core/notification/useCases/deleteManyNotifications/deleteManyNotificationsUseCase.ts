import { INotificationRepository } from "../../../../repositories/notification/INotificationRepository";

export default class DeleteManyNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({
    userId,
    notificationsId,
  }: {
    userId: string;
    notificationsId: string[];
  }) {
    await this.notificationRepository.deleteMany({
      userId,
      notificationsId,
    });
  }
}
