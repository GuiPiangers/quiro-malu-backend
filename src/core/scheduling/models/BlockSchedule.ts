import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { BlockScheduleDto } from "./dtos/BlockSchedule.dto";
import { Scheduling } from "./Scheduling";

export type BlockScheduleParams = {
  id?: string;
  date: DateTime;
  endDate: DateTime;
  description?: string;
};

export class BlockSchedule extends Entity {
  readonly date: DateTime;
  readonly endDate: DateTime;
  readonly description?: string;

  constructor({
    description,
    endDate,
    date: startDate,
    id,
  }: BlockScheduleParams) {
    super(id);
    this.date = startDate;
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
      startDate: blockSchedule.date,
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
      this.date.dateTime <= startDate.dateTime &&
      startDate.dateTime < this.endDate.dateTime;

    const unavailableEndDate =
      this.date.dateTime < endDate.dateTime &&
      endDate.dateTime < this.endDate.dateTime;

    const hasSameDates =
      startDate.dateTime === this.date.dateTime &&
      endDate.dateTime === this.endDate.dateTime;

    console.table({
      testStartDate: startDate.dateTime,
      testEndDate: endDate.dateTime,
      startDate: this.date.dateTime,
      endDate: this.endDate.dateTime,
      hasSameDates,
    });
    console.log(hasSameDates);

    return unavailableStartDate || unavailableEndDate || hasSameDates;
  }

  getDTO(): BlockScheduleDto {
    return {
      id: this.id,
      date: this.date.dateTime,
      endDate: this.endDate.dateTime,
      description: this.description,
    };
  }
}
