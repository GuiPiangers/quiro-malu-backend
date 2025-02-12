import { SubscribeNotificationUseCase } from "../../useCases/subscribeNotification/subscribeNotificationUseCase";
import { SubscribeNotificationController } from "./subscribeNotificationController";
import { PushNotificationProvider } from "../../../../repositories/notification/PushNotificationProvider";

const pushNotificationProvider = new PushNotificationProvider();

const subscribeNotificationUseCase = new SubscribeNotificationUseCase(
  pushNotificationProvider,
);

const subscribeNotificationController = new SubscribeNotificationController(
  subscribeNotificationUseCase,
);

export { subscribeNotificationController };
