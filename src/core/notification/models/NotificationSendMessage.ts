import { Phone } from "../../shared/Phone";
import { ComplexNotification } from "./Notification";

export type NotificationSendMessageParams = {
  patientId: string;
  patientPhone: Phone;
};

export class NotificationSendMessage extends ComplexNotification<NotificationSendMessageParams> {}
