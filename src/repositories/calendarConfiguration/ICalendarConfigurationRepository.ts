import { CalendarConfiguration } from "../../core/calendarConfiguration/models/CalendarConfiguration";

export type GetCalendarConfiguration = {
  userId: string;
};

export type SaveCalendarConfiguration = {
  calendarConfiguration: CalendarConfiguration;
};

export type UpdateCalendarConfiguration = {
  calendarConfiguration: CalendarConfiguration;
};

export interface ICalendarConfigurationRepository {
  save(data: SaveCalendarConfiguration): Promise<void>;
  update(data: UpdateCalendarConfiguration): Promise<void>;
  get(data: GetCalendarConfiguration): Promise<CalendarConfiguration | null>;
}
