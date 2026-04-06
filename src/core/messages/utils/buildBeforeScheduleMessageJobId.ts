export function buildBeforeScheduleMessageJobId({
  userId,
  scheduleId,
  beforeScheduleMessageId,
}: {
  userId: string;
  scheduleId: string;
  beforeScheduleMessageId: string;
}): string {
  const raw =
    "before-schedule_" +
    userId +
    "_" +
    scheduleId +
    "_" +
    beforeScheduleMessageId;

  return raw.substring(0, 250);
}
