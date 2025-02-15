import { pushNotificationQueue } from "../../../../database/bull/pushNotifications/pushNotificationsQueue";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { ScheduleNotificationUseCase } from "./ScheduleNotificationUseCase";

const patientRepository = new KnexPatientRepository();
const scheduleNotificationUseCase = new ScheduleNotificationUseCase(
  pushNotificationQueue,
  patientRepository,
);

export { scheduleNotificationUseCase };
