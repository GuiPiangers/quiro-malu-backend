import { pushNotificationQueue } from "../../../../database/bull/pushNotifications/pushNotificationsQueue";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { ScheduleNotificationUseCase } from "./ScheduleNotificationUseCase";

const schedulingRepository = new MySqlSchedulingRepository();
const scheduleNotificationUseCase = new ScheduleNotificationUseCase(
  pushNotificationQueue,
  schedulingRepository,
);

export { scheduleNotificationUseCase };
