import { pushNotificationQueue } from "../../../../database/bull/pushNotifications/pushNotificationsQueue";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ScheduleNotificationUseCase } from "./ScheduleNotificationUseCase";

const schedulingRepository = new KnexSchedulingRepository();
const scheduleNotificationUseCase = new ScheduleNotificationUseCase(
  pushNotificationQueue,
  schedulingRepository,
);

export { scheduleNotificationUseCase };
