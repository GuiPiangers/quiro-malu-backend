import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import SendAppNotificationUseCase from "../../useCases/sendNotificationUseCase";
import { SendNotificationController } from "./sendNotificationController";

const notificationRepository = new MongoNotificationRepository();
const sendNotificationUseCase = new SendAppNotificationUseCase(
  notificationRepository,
);

const sendNotificationController = new SendNotificationController(
  sendNotificationUseCase,
);

export { sendNotificationController };
