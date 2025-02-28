import { PushNotificationDTO } from "../../../core/notification/models/PushNotification";

export type PushNotificationQueuePrams = {
  notification: PushNotificationDTO;
  userId: string;
  delay: number;
};

export type deleteNotificationQueueParams = {
  id: string;
};

export interface IPushNotificationQueue {
  add: (data: PushNotificationQueuePrams) => void;
  delete: (data: deleteNotificationQueueParams) => Promise<void>;
}
