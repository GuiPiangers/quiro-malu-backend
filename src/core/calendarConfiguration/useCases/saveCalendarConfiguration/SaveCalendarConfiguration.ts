import { ICalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository";
import {
  CalendarConfiguration,
  DayConfiguration,
} from "../../models/CalendarConfiguration";

export type SaveCalendarConfigurationDTO = {
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

export class SaveCalendarConfigurationUseCase {
  constructor(
    private calendarConfigurationRepository: ICalendarConfigurationRepository,
  ) {}

  async execute(dto: SaveCalendarConfigurationDTO) {
    const existingConfig = await this.calendarConfigurationRepository.get({
      userId: dto.userId,
    });

    const calendarConfiguration = new CalendarConfiguration({
      ...dto,
    });

    if (existingConfig) {
      await this.calendarConfigurationRepository.update({
        calendarConfiguration,
      });
    } else {
      await this.calendarConfigurationRepository.save({
        calendarConfiguration,
      });
    }
  }
}
