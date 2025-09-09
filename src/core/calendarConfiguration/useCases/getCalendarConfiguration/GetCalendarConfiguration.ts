import { ICalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository";
import { CalendarConfigurationDTO } from "../../models/CalendarConfiguration";

export type GetCalendarConfigurationDTO = {
  userId: string;
};

export class GetCalendarConfigurationUseCase {
  constructor(
    private calendarConfigurationRepository: ICalendarConfigurationRepository,
  ) {}

  async execute({
    userId,
  }: GetCalendarConfigurationDTO): Promise<CalendarConfigurationDTO | null> {
    const config = await this.calendarConfigurationRepository.get({ userId });

    if (!config) {
      return null;
    }

    return config.getDTO();
  }
}
