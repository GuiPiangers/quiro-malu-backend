import { scheduleNotificationUseCase } from "../core/notification/useCases/ScheduleNotification";
import { schedulingObserver } from "../core/shared/observers/SchedulingObserver/SchedulingObserver";

export function start() {
  schedulingObserver.on("create", async (data) => {
    scheduleNotificationUseCase.schedule(data);
  });
}
