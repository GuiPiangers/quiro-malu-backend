import { NotificationDTO } from "../../core/notification/models/Notification";
import { NotificationModel } from "../../database/mongoose/schemas/Notification";
import {
  CountNotReadNotificationParams,
  DeleteNotificationParams,
  GetNotificationParams,
  INotificationRepository,
  ListNotificationParams,
  SaveNotificationParams,
  UpdateNotificationParams,
} from "./INotificationRepository";

export class MongoNotificationRepository implements INotificationRepository {
  async save(data: SaveNotificationParams): Promise<void> {
    await NotificationModel.create(data);
  }

  async delete({ id, userId }: DeleteNotificationParams): Promise<void> {
    NotificationModel.deleteOne({ id, userId });
  }

  async update({
    id,
    userId,
    ...data
  }: UpdateNotificationParams): Promise<void> {
    await NotificationModel.updateOne({ id, userId }, data);
  }

  async get<T>({
    id,
    userId,
  }: GetNotificationParams): Promise<NotificationDTO<T> | null> {
    return await NotificationModel.findOne({ userId, id });
  }

  async list({
    userId,
    config,
  }: ListNotificationParams): Promise<NotificationDTO[]> {
    return await NotificationModel.find<NotificationDTO>({ userId }).sort({
      createdAt: -1,
    });
  }

  async countNotReadOrNeedAct({
    userId,
  }: CountNotReadNotificationParams): Promise<number> {
    return await NotificationModel.countDocuments({
      userId,
      $or: [{ read: false }, { actionNeeded: true }],
    });
  }
}
