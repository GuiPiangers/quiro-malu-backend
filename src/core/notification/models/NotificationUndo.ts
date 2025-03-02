import { ComplexNotification, ComplexNotificationDTO } from "./Notification";

export type NotificationUndoExamParams = {
  id: string;
  userId: string;
  patientId: string;
};

export class NotificationUndoExam extends ComplexNotification<NotificationUndoExamParams> {
  constructor(data: ComplexNotificationDTO<NotificationUndoExamParams>) {
    super({
      ...data,
      type: "undoExam",
    });
  }
}
