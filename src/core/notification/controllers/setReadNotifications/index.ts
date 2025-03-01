import ListNotificationsUseCase from "../../useCases/listNotifications/listNotificationsUseCase";
import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import { SetReadNotificationsController } from "./setReadNotificationsController";
import { SetReadNotificationsUseCase } from "../../useCases/setReadNotifications/setReadNotificationUseCase";

const notificationRepository = new MongoNotificationRepository();

const setReadNotificationsUseCase = new SetReadNotificationsUseCase(
  notificationRepository,
);

const setReadNotificationsController = new SetReadNotificationsController(
  setReadNotificationsUseCase,
);

export { setReadNotificationsController };
