import { DateTime } from "../../shared/Date";
import { AvailableAppEvents } from "../../shared/observers/EventListener";

export type TriggerDTO = {
  event: AvailableAppEvents;
  delayOperatorInMinutes?: number;
};

export class Trigger {
  readonly event: AvailableAppEvents;
  readonly delayOperatorInMinutes: number;
  constructor({ event, delayOperatorInMinutes }: TriggerDTO) {
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
