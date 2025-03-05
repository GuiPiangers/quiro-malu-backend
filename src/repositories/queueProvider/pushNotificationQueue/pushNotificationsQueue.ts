import { PushNotificationDTO } from "../../../core/notification/models/PushNotification";
import { sendPushNotificationUseCase } from "../../../core/notification/useCases/sendPushNotification";
import { IQueueProvider } from "../IQueueProvider";

export type PushNotificationQueuePrams = {
  notification: PushNotificationDTO;
  userId: string;
  delay: number;
};

export type deleteNotificationQueueParams = {
  id: string;
};

export class PushNotificationQueue {
  constructor(
    private queueProvider: IQueueProvider<{
      notification: PushNotificationDTO;
      userId: string;
    }>,
  ) {}

  async add({ delay, notification, userId }: PushNotificationQueuePrams) {
    await this.queueProvider.add(
      { notification, userId },
      { delay, jobId: `a${notification.id}` },
    );
  }

  async delete({ id }: deleteNotificationQueueParams) {
    await this.queueProvider.delete({ jobId: `a${id}` });
  }

  async process() {
    this.queueProvider.process(async (job) => {
      sendPushNotificationUseCase.execute({
        notificationData: job.notification,
        userId: job.userId,
      });
    });
  }
}
