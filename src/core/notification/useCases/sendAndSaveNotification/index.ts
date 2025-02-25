import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import SaveSendNotificationUseCase from "./sendAndSaveNotification";

const notificationRepository = new MongoNotificationRepository();

const sendAndSaveNotificationUseCase = new SaveSendNotificationUseCase(
  notificationRepository,
);

export { sendAndSaveNotificationUseCase };
