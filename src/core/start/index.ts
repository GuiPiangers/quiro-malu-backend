import { scheduleNotificationUseCase } from "../notification/useCases/ScheduleNotification";
import { schedulingObserver } from "../shared/observers/SchedulingObserver/SchedulingObserver";

export function start() {
  schedulingObserver.on("create", async (data) => {
    scheduleNotificationUseCase.schedule(data);
  });
}
