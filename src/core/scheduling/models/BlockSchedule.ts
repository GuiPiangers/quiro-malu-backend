import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { Scheduling } from "./Scheduling";

export type BlockScheduleParams = {
  id?: string;
  startDate: DateTime;
  endDate: DateTime;
  description?: string;
};

export class BlockSchedule extends Entity {
  readonly startDate: DateTime;
  readonly endDate: DateTime;
  readonly description?: string;

  constructor({ description, endDate, startDate, id }: BlockScheduleParams) {
    super(id);
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
  }

  overlapsWith(schedule: Scheduling) {
    if (!schedule.date || !schedule.duration) return false;

    const scheduleStartDate = schedule.date.dateTime;

    const scheduleEnd = schedule.date.value
      .set({
        second: schedule.duration,
      })
      .toISO();

    const scheduleEndDate = new DateTime(scheduleEnd ?? scheduleStartDate)
      .dateTime;

    const unavailableStartDate =
      this.startDate.dateTime <= scheduleStartDate &&
      scheduleStartDate < this.endDate.dateTime;

    const unavailableEndDate =
      this.startDate.dateTime < scheduleEndDate &&
      scheduleEndDate < this.endDate.dateTime;

    return unavailableStartDate || unavailableEndDate;
  }
}
