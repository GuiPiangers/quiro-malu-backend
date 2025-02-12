import { SendPushNotificationUseCase } from "./SendPushNotificationUseCase";
import { PushNotificationProvider } from "../../../../repositories/notification/PushNotificationProvider";

const pushNotificationProvider = new PushNotificationProvider();
const sendPushNotificationUseCase = new SendPushNotificationUseCase(
  pushNotificationProvider,
);

export { sendPushNotificationUseCase };
