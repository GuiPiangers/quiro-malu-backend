import { DateTime } from "../../shared/Date";
import { AvailableAppEvents } from "../../shared/observers/EventListener";

export type TriggerDTO = {
  event: AvailableAppEvents;
};

export class Trigger {
  readonly event: AvailableAppEvents;
  constructor({ event }: TriggerDTO) {
    this.event = event;
  }

  calculateDelay({
    date,
    delayInMinutes = 0,
  }: {
    date: DateTime;
    delayInMinutes?: number;
  }) {
    const newDate = date.value.plus({ minute: delayInMinutes }).toISO();

    if (!newDate) return 0;

    const newDateTime = new DateTime(newDate);

    const delay = DateTime.difference(newDateTime, DateTime.now());

    return delay > 0 ? delay : 0;
  }
}

export class TriggerWithScheduledDelay extends Trigger {
  constructor(
    { event }: TriggerDTO,
    readonly config: {
      delay: number;
      delayUnit: "minutes" | "hours" | "days";
    },
  ) {
    super({ event });
  }

  calculateDelay({ date }: { date: DateTime }) {
    const minutesConverterTable = {
      minutes: 1,
      hours: 60,
      days: 60 * 24,
    };

    const { delay, delayUnit } = this.config;
    const delayInMinutes = delay * minutesConverterTable[delayUnit];
    return super.calculateDelay({ date, delayInMinutes });
  }
}

export class TriggerWithScheduledDate extends Trigger {
  constructor(
    { event }: TriggerDTO,
    readonly config: {
      date: DateTime;
    },
  ) {
    super({ event });
  }

  calculateDelay() {
    const { date } = this.config;
    return super.calculateDelay({ date });
  }
}
