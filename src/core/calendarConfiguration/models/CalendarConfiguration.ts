export type WorkSchedule = {
  start: string;
  end: string;
};

export type DayConfiguration = {
  workSchedules: WorkSchedule[];
  isActive?: boolean;
};

export type CalendarConfigurationDTO = {
  userId: string;
  workTimeIncrementInMinutes?: number;
  domingo?: DayConfiguration;
  segunda?: DayConfiguration;
  terca?: DayConfiguration;
  quarta?: DayConfiguration;
  quinta?: DayConfiguration;
  sexta?: DayConfiguration;
  sabado?: DayConfiguration;
};

export class CalendarConfiguration {
  readonly workTimeIncrementInMinutes: number;
  readonly userId: string;
  readonly domingo?: DayConfiguration;
  readonly segunda?: DayConfiguration;
  readonly terca?: DayConfiguration;
  readonly quarta?: DayConfiguration;
  readonly quinta?: DayConfiguration;
  readonly sexta?: DayConfiguration;
  readonly sabado?: DayConfiguration;

  constructor(dto: CalendarConfigurationDTO) {
    this.userId = dto.userId;
    this.workTimeIncrementInMinutes = dto.workTimeIncrementInMinutes || 30;
    this.domingo = dto.domingo;
    this.segunda = dto.segunda;
    this.terca = dto.terca;
    this.quarta = dto.quarta;
    this.quinta = dto.quinta;
    this.sexta = dto.sexta;
    this.sabado = dto.sabado;
  }

  getDTO(): CalendarConfigurationDTO {
    return {
      userId: this.userId,
      workTimeIncrementInMinutes: this.workTimeIncrementInMinutes,
      domingo: this.domingo,
      segunda: this.segunda,
      terca: this.terca,
      quarta: this.quarta,
      quinta: this.quinta,
      sexta: this.sexta,
      sabado: this.sabado,
    };
  }
}
