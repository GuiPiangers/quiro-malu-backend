import { ICalendarConfigurationRepository } from "../calendarConfiguration/ICalendarConfigurationRepository";
import type { Mocked } from "vitest";

export const createMockCalendarConfigurationRepository =
  (): Mocked<ICalendarConfigurationRepository> => ({
    get: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  });
