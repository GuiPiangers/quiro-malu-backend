import { Notification, NotificationDTO } from "./Notification";
import {
  NotificationSendMessage,
  NotificationSendMessageParams,
} from "./NotificationSendMessage";

export type notificationsTablesParams = {
  default: undefined;
  sendMessage: NotificationSendMessageParams;
  undo: { item: "Ola, tudo bem" };
};

export type notificationTypes = keyof notificationsTablesParams;

export function notificationFactory<T extends notificationTypes>(
  type: T,
  data: (NotificationDTO | NotificationDTO<notificationsTablesParams[T]>) & {
    type: T;
  },
) {
  if (data.params) {
    const dataParams: any = data;
    switch (type) {
      case "sendMessage":
        return new NotificationSendMessage(dataParams);

      default:
        break;
    }
  }
  return new Notification(data as NotificationDTO);
}
