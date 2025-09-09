export type WorkSchedule = {
  start: string;
  end: string;
};

export type DayConfiguration = {
  workTimeIncrementInMinutes: number;
  workSchedules: WorkSchedule[];
};

export type CalendarConfigurationDTO = {
  userId: string;
  0?: DayConfiguration;
  1?: DayConfiguration;
  2?: DayConfiguration;
  3?: DayConfiguration;
  4?: DayConfiguration;
  5?: DayConfiguration;
  6?: DayConfiguration;
};

export class CalendarConfiguration {
  readonly userId: string;
  readonly 0?: DayConfiguration;
  readonly 1?: DayConfiguration;
  readonly 2?: DayConfiguration;
  readonly 3?: DayConfiguration;
  readonly 4?: DayConfiguration;
  readonly 5?: DayConfiguration;
  readonly 6?: DayConfiguration;

  constructor(dto: CalendarConfigurationDTO) {
    this.userId = dto.userId;
    this[0] = dto[0];
    this[1] = dto[1];
    this[2] = dto[2];
    this[3] = dto[3];
    this[4] = dto[4];
    this[5] = dto[5];
    this[6] = dto[6];
  }

  getDTO(): CalendarConfigurationDTO {
    return {
      userId: this.userId,
      0: this[0],
      1: this[1],
      2: this[2],
      3: this[3],
      4: this[4],
      5: this[5],
      6: this[6],
    };
  }
}
