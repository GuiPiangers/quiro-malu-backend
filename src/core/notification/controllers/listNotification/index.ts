import ListNotificationsUseCase from "../../useCases/listNotifications/listNotificationsUseCase";
import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import { ListNotificationsController } from "./listNotificationController";

const notificationRepository = new MongoNotificationRepository();

const listNotificationsUseCase = new ListNotificationsUseCase(
  notificationRepository,
);

const listNotificationsController = new ListNotificationsController(
  listNotificationsUseCase,
);

export { listNotificationsController };
