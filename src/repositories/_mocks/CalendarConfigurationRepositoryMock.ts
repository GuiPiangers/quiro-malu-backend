import { ICalendarConfigurationRepository } from "../calendarConfiguration/ICalendarConfigurationRepository";

export const createMockCalendarConfigurationRepository =
  (): jest.Mocked<ICalendarConfigurationRepository> => ({
    get: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  });
