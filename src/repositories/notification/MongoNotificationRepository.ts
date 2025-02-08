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
  async save({
    id,
    message,
    read,
    title,
    type,
    userId,
  }: SaveNotificationParams): Promise<void> {
    await NotificationModel.create({ id, message, read, title, type, userId });
  }

  async delete({ id, userId }: DeleteNotificationParams): Promise<void> {
    NotificationModel.deleteOne({ id, userId });
  }

  async update({
    id,
    userId,
    message,
    read,
    title,
    type,
  }: UpdateNotificationParams): Promise<void> {
    await NotificationModel.updateOne(
      { id, userId },
      {
        message,
        read,
        title,
        type,
      },
    );
  }

  async get({
    id,
    userId,
  }: GetNotificationParams): Promise<NotificationDTO | null> {
    return await NotificationModel.findOne({ userId, id });
  }

  async list({
    userId,
    config,
  }: ListNotificationParams): Promise<NotificationDTO[]> {
    return await NotificationModel.find({ userId });
  }

  async countNotRead({
    userId,
  }: CountNotReadNotificationParams): Promise<number> {
    return await NotificationModel.countDocuments({ userId, read: true });
  }
}
