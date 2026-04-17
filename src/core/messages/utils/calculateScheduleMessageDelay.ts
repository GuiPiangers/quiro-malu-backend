import { DateTime } from "../../shared/Date";

export function calculateScheduleMessageDelay({
  scheduleDate,
  minutesOffset,
  direction,
}: {
  scheduleDate: string | undefined;
  minutesOffset: number;
  direction: "before" | "after";
}): number {
  if (!scheduleDate) return 0;

  const schedule = new DateTime(scheduleDate).value;
  const targetDate =
    direction === "before"
      ? schedule.minus({ minutes: minutesOffset })
      : schedule.plus({ minutes: minutesOffset });

  const now = DateTime.now().value;
  const delay = targetDate.toMillis() - now.toMillis();

  return delay > 0 ? delay : 0;
}
