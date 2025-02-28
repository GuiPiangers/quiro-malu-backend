import { Phone } from "../../shared/Phone";
import { ComplexNotification, ComplexNotificationDTO } from "./Notification";

export type NotificationSendMessageParams = {
  patientId: string;
  patientPhone: Phone;
};

export class NotificationSendMessage extends ComplexNotification<NotificationSendMessageParams> {
  constructor(data: ComplexNotificationDTO<NotificationSendMessageParams>) {
    super({ ...data, type: "sendMessage" });
  }
}
