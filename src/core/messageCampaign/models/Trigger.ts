import { DateTime } from "../../shared/Date";
import { AvailableAppEvents } from "../../shared/observers/EventListener";

export type TriggerDTO<T = undefined> = {
  event: AvailableAppEvents;
  config?: T;
};

export class TriggerBase {
  readonly event: AvailableAppEvents;
  constructor({ event }: TriggerDTO) {
    this.event = event;
  }

  readonly config = {};

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

  getDTO() {
    return {
      event: this.event,
      config: this.config,
    };
  }
}

type TriggerWithDelayConfig = {
  delay: number;
  delayUnit: "minutes" | "hours" | "days";
};

export class TriggerWithDelay extends TriggerBase {
  readonly config: TriggerWithDelayConfig;

  constructor({ event, config }: TriggerDTO<TriggerWithDelayConfig>) {
    super({ event });
    this.config = config || { delay: 0, delayUnit: "minutes" };
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

type TriggerWithStaticDateConfig = {
  date: DateTime;
};

export class TriggerWithStaticDate extends TriggerBase {
  readonly config: TriggerWithStaticDateConfig;
  constructor({ event, config }: TriggerDTO<TriggerWithStaticDateConfig>) {
    super({ event });
    this.config = config || { date: DateTime.now() };
  }

  calculateDelay() {
    const { date } = this.config;
    return super.calculateDelay({ date });
  }
}

export class TriggerWithDynamicDate extends TriggerBase {
  constructor({ event }: TriggerDTO) {
    super({ event });
  }

  calculateDelay({ date }: { date: DateTime }) {
    return super.calculateDelay({ date });
  }
}

export type Trigger =
  | TriggerWithDelay
  | TriggerWithStaticDate
  | TriggerWithDynamicDate;
