import {
  ComplexNotification,
  Notification,
  NotificationDTO,
} from "./Notification";
import {
  NotificationSendMessage,
  NotificationSendMessageParams,
} from "./NotificationSendMessage";
import { NotificationUndoExamParams } from "./NotificationUndo";

export type notificationsTablesParams = {
  default: undefined;
  sendMessage: NotificationSendMessageParams;
  undoExam: NotificationUndoExamParams;
};

export type notificationTypes = keyof notificationsTablesParams;

export function notificationFactory<T extends notificationTypes>(
  type: T,
  data: (NotificationDTO | NotificationDTO<notificationsTablesParams[T]>) & {
    type: T;
  },
): Notification | ComplexNotification<T> {
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
