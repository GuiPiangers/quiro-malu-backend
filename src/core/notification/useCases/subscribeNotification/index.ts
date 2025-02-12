import { SubscribeNotificationUseCase } from "./subscribeNotificationUseCase";
import { SubscribeNotificationController } from "../../controllers/subscribeNotification/subscribeNotificationController";
import { PushNotificationProvider } from "../../../../repositories/notification/PushNotificationProvider";

const pushNotificationProvider = new PushNotificationProvider();

const subscribeNotificationUseCase = new SubscribeNotificationUseCase(
  pushNotificationProvider,
);

const subscribeNotificationController = new SubscribeNotificationController(
  subscribeNotificationUseCase,
);

export { subscribeNotificationController };
