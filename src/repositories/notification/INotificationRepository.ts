import { NotificationDTO } from "../../core/notification/models/Notification";

export type SaveNotificationParams = NotificationDTO & {
  id: string;
  userId: string;
};

export type UpdateNotificationParams = NotificationDTO & {
  id: string;
  userId: string;
};

export type GetNotificationParams = {
  id: string;
  userId: string;
};

export type ListNotificationParams = {
  userId: string;
  config?: { offset: number; limit: number };
};

export type CountNotReadNotificationParams = {
  userId: string;
};

export type DeleteNotificationParams = { userId: string; id: string };

export interface INotificationRepository {
  save(data: SaveNotificationParams): Promise<void>;
  delete(data: DeleteNotificationParams): Promise<void>;
  update(data: UpdateNotificationParams): Promise<void>;
  get(data: GetNotificationParams): Promise<void>;
  list(data: ListNotificationParams): Promise<void>;
  countNotRead(data: CountNotReadNotificationParams): Promise<number>;
}
