import {
  ComplexNotificationDTO,
  Notification,
  NotificationDTO,
} from "./Notification";
import {
  NotificationSendMessage,
  NotificationSendMessageParams,
} from "./NotificationSendMessage";

type notificationsTablesParams = {
  sendMessage: NotificationSendMessageParams;
};

export function notificationFactory(
  type: "sendMessage",
  data:
    | NotificationDTO
    | ComplexNotificationDTO<notificationsTablesParams[typeof type]>,
) {
  if ("params" in data) {
    switch (type) {
      case "sendMessage":
        return new NotificationSendMessage(data);

      default:
        break;
    }
  }
  return new Notification(data);
}
