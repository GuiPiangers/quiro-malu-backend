import { NotificationDOT } from "../../core/notification/models/Notification";

export type SaveNotificationParams = NotificationDOT & {
  id: string;
  userId: string;
};

export type UpdateNotificationParams = NotificationDOT & {
  id: string;
  userId: string;
};

export type GetNotificationParams = NotificationDOT & {
  id: string;
  userId: string;
};

export type ListNotificationParams = NotificationDOT & {
  userId: string;
  config?: { offset: number; limit: number };
};

export type DeleteNotificationParams = { userId: string; id: string };

export interface INotificationRepository {
  save(data: SaveNotificationParams): Promise<void>;
  delete(data: DeleteNotificationParams): Promise<void>;
  update(data: UpdateNotificationParams): Promise<void>;
  get(data: GetNotificationParams): Promise<void>;
  list(data: ListNotificationParams): Promise<void>;
}
