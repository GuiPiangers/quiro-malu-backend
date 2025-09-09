import { ICalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository";
import {
  CalendarConfiguration,
  DayConfiguration,
} from "../../models/CalendarConfiguration";

export type SaveCalendarConfigurationDTO = {
  userId: string;
  0?: DayConfiguration;
  1?: DayConfiguration;
  2?: DayConfiguration;
  3?: DayConfiguration;
  4?: DayConfiguration;
  5?: DayConfiguration;
  6?: DayConfiguration;
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
