export function buildScheduleMessageJobId({
  prefix,
  userId,
  scheduleId,
  configId,
}: {
  prefix: string;
  userId: string;
  scheduleId: string;
  configId: string;
}): string {
  const raw = `${prefix}_${userId}_${scheduleId}_${configId}`;
  return raw.substring(0, 250);
}
