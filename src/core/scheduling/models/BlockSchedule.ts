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

  overlapsWithSchedule(schedule: Scheduling) {
    if (!schedule.date || !schedule.duration) return false;

    const scheduleStartDate = schedule.date;

    const scheduleEnd = schedule.date.value
      .set({
        second: schedule.duration,
      })
      .toISO();

    const scheduleEndDate = new DateTime(
      scheduleEnd ?? scheduleStartDate.dateTime,
    );

    return this.overlapsDate({
      endDate: scheduleEndDate,
      startDate: scheduleStartDate,
    });
  }

  overlapsWithBlockSchedule(blockSchedule: BlockSchedule): boolean {
    return this.overlapsDate({
      endDate: blockSchedule.endDate,
      startDate: blockSchedule.startDate,
    });
  }

  private overlapsDate({
    endDate,
    startDate,
  }: {
    startDate: DateTime;
    endDate: DateTime;
  }): boolean {
    const unavailableStartDate =
      this.startDate.dateTime <= startDate.dateTime &&
      startDate.dateTime < this.endDate.dateTime;

    const unavailableEndDate =
      this.startDate.dateTime < endDate.dateTime &&
      endDate.dateTime < this.endDate.dateTime;

    const hasSameDates =
      startDate.dateTime === this.startDate.dateTime &&
      endDate.dateTime === this.endDate.dateTime;

    console.table({
      testStartDate: startDate.dateTime,
      testEndDate: endDate.dateTime,
      startDate: this.startDate.dateTime,
      endDate: this.endDate.dateTime,
      hasSameDates,
    });
    console.log(hasSameDates);

    return unavailableStartDate || unavailableEndDate || hasSameDates;
  }
}
