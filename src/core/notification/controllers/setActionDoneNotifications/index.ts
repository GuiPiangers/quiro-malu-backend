import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import { SetActionDoneNotificationController } from "./setActionDoneNotificationsController";
import { SetActionDoneNotificationUseCase } from "../../useCases/setActionDoneNotifications/setActionDoneNotificationUseCase";

const notificationRepository = new MongoNotificationRepository();

const setActionDoneNotificationUseCase = new SetActionDoneNotificationUseCase(
  notificationRepository,
);

const setActionDoneNotificationController =
  new SetActionDoneNotificationController(setActionDoneNotificationUseCase);

export { setActionDoneNotificationController };
