import { UnsubscribeNotificationController } from "./UnsubscribeNotificationController";
import { PushNotificationProvider } from "../../../../repositories/notification/PushNotificationProvider";
import { UnsubscribeNotificationUseCase } from "../../useCases/unsubscribeNotification/unsubscribeNotificationUseCase";

const pushNotificationProvider = new PushNotificationProvider();

const unsubscribeNotificationUseCase = new UnsubscribeNotificationUseCase(
  pushNotificationProvider,
);

const unsubscribeNotificationController = new UnsubscribeNotificationController(
  unsubscribeNotificationUseCase,
);

export { unsubscribeNotificationController };
