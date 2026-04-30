import { pushNotificationQueue } from "../../../../database/bull/pushNotifications/pushNotificationsQueue";
import { ScheduleNotificationUseCase } from "./ScheduleNotificationUseCase";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const scheduleNotificationUseCase = new ScheduleNotificationUseCase(
  pushNotificationQueue,
  schedulingRepository,
);

export { scheduleNotificationUseCase };