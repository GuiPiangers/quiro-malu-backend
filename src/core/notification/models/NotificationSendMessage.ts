import { Phone } from "../../shared/Phone";
import { ComplexNotification } from "./Notification";

export class NotificationSendMessage extends ComplexNotification<{
  patientId: string;
  patientPhone: Phone;
}> {}
