import { buildScheduleMessageJobId } from "./buildScheduleMessageJobId";

export function buildBeforeScheduleMessageJobId({
  userId,
  scheduleId,
  beforeScheduleMessageId,
}: {
  userId: string;
  scheduleId: string;
  beforeScheduleMessageId: string;
}): string {
  return buildScheduleMessageJobId({
    prefix: "before-schedule",
    userId,
    scheduleId,
    configId: beforeScheduleMessageId,
  });
}
