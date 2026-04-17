import { buildScheduleMessageJobId } from "./buildScheduleMessageJobId";

export function buildAfterScheduleMessageJobId({
  userId,
  scheduleId,
  afterScheduleMessageId,
}: {
  userId: string;
  scheduleId: string;
  afterScheduleMessageId: string;
}): string {
  return buildScheduleMessageJobId({
    prefix: "after-schedule",
    userId,
    scheduleId,
    configId: afterScheduleMessageId,
  });
}
