import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { NotificationDTO } from "../../../core/notification/models/Notification";
import { sendPushNotificationUseCase } from "../../../core/notification/useCases/sendPushNotification";
import {
  deleteNotificationQueueParams,
  IPushNotificationQueue,
  PushNotificationQueuePrams,
} from "./IPushNotificationQueue";

const host = process.env.DB_REDIS_HOST;

const connection = new IORedis({
  host,
  maxRetriesPerRequest: null,
});

export class PushNotificationQueue implements IPushNotificationQueue {
  private pushNotificationQueue = new Queue("pushNotification", { connection });

  async add({ delay, notification, userId }: PushNotificationQueuePrams) {
    await this.pushNotificationQueue.add(
      "notifyUser",
      { notification, userId },
      {
        jobId: `a${notification.id}`,
        delay,
        removeOnComplete: 60 * 10, // 10 min
        removeOnFail: 60 * 10, // 10 min
      },
    );
  }

  async delete({ id }: deleteNotificationQueueParams) {
    await this.pushNotificationQueue.remove(`a${id}`);
  }
}

const pushNotificationQueue = new PushNotificationQueue();

const worker = new Worker(
  "pushNotification",
  async (job) => {
    const data = job.data as { notification: NotificationDTO; userId: string };
    sendPushNotificationUseCase.execute({
      notificationData: data.notification,
      userId: data.userId,
    });
  },
  { connection },
);

worker.on("error", (error) => console.log(error));

export { pushNotificationQueue };
