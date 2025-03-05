import { PushNotificationDTO } from "../../../core/notification/models/PushNotification";
import { QueueProvider } from "../queueProvider";
import { PushNotificationQueue } from "./pushNotificationsQueue";

const queueProvider = new QueueProvider<{
  notification: PushNotificationDTO;
  userId: string;
}>("pushNotification");

const pushNotificationQueue = new PushNotificationQueue(queueProvider);

pushNotificationQueue.process();

export { pushNotificationQueue };
