import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import SendNotificationUseCase from "../../useCases/sendNotificationUseCase";
import { SendNotificationController } from "./sendNotificationController";

const notificationRepository = new MongoNotificationRepository();
const sendNotificationUseCase = new SendNotificationUseCase(
  notificationRepository,
);

const sendNotificationController = new SendNotificationController(
  sendNotificationUseCase,
);

export { sendNotificationController };
