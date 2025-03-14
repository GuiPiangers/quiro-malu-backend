import { DateTime } from "./Date";

export function calculateAge(date: string | DateTime) {
  const dateTime = typeof date === "string" ? new DateTime(date) : date;

  const age = dateTime.value.diffNow("year").years;

  return age;
}
