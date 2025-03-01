import { Phone } from "../../shared/Phone";
import { ComplexNotification, ComplexNotificationDTO } from "./Notification";

export type NotificationSendMessageParams = {
  patientId: string;
  patientPhone: Phone;
};

type ComplexNotificationParams = Omit<
  NotificationSendMessageParams,
  "patientPhone"
> & {
  patientPhone: string;
};

export class NotificationSendMessage extends ComplexNotification<ComplexNotificationParams> {
  constructor(data: ComplexNotificationDTO<NotificationSendMessageParams>) {
    super({
      ...data,
      type: "sendMessage",
      params: {
        ...data.params,
        patientPhone: data.params.patientPhone.value,
      },
    });
  }
}
