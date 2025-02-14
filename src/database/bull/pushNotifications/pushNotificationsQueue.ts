import { Queue } from "bullmq";
import IORedis from "ioredis";
import { NotificationDTO } from "../../../core/notification/models/Notification";
import { Crypto } from "../../../core/shared/helpers/Crypto";

const host = process.env.DB_HOST;
const redisPassword = process.env.REDIS_PASSWORD;

const connection = new IORedis({ host, password: redisPassword });

export class PushNotificationQueue {
  private pushNotificationQueue = new Queue("pushNotification", { connection });

  async add({
    delay,
    notification,
    userId,
  }: {
    notification: NotificationDTO;
    userId: string;
    delay: number;
  }) {
    await this.pushNotificationQueue.add(
      "notifyUser",
      { notification, userId },
      {
        delay,
        removeOnComplete: 60 * 10, // 10 min
        removeOnFail: 60 * 10, // 10 min
      },
    );
  }
}

export const pushNotificationQueue = new PushNotificationQueue();
