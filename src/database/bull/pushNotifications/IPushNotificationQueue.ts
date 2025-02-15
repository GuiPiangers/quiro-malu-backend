import { NotificationDTO } from "../../../core/notification/models/Notification";

export type PushNotificationQueuePrams = {
  notification: NotificationDTO;
  userId: string;
  delay: number;
};

export interface IPushNotificationQueue {
  add: (data: PushNotificationQueuePrams) => void;
}
