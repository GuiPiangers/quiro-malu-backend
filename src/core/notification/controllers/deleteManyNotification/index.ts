import { MongoNotificationRepository } from "../../../../repositories/notification/MongoNotificationRepository";
import { DeleteManyNotificationsController } from "./deleteManyNotificationController";
import DeleteManyNotificationsUseCase from "../../useCases/deleteManyNotifications/deleteManyNotificationsUseCase";

const notificationRepository = new MongoNotificationRepository();

const deleteManyNotificationsUseCase = new DeleteManyNotificationsUseCase(
  notificationRepository,
);

const deleteManyNotificationsController = new DeleteManyNotificationsController(
  deleteManyNotificationsUseCase,
);

export { deleteManyNotificationsController };
