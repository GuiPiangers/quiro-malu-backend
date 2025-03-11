import { DateTime } from "../../shared/Date";

export class Trigger {
  readonly event: string;
  readonly delayOperatorInMinutes: number;
  constructor({
    event,
    delayOperatorInMinutes,
  }: {
    event: string;
    delayOperatorInMinutes?: number;
  }) {
    this.event = event;
    this.delayOperatorInMinutes = delayOperatorInMinutes ?? 0;
  }

  calculateDelay(date: DateTime) {
    const newDate = date.value
      .plus({ minute: this.delayOperatorInMinutes })
      .toISO();

    if (!newDate) return 0;

    const newDateTime = new DateTime(newDate);

    const delay = DateTime.difference(newDateTime, DateTime.now());

    return delay > 0 ? delay : 0;
  }
}
