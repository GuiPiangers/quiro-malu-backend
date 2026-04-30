import { IBlockScheduleRepository } from "../blockScheduleRepository/IBlockScheduleRepository";
import type { Mocked } from "vitest";

export const createMockBlockScheduleRepository =
  (): Mocked<IBlockScheduleRepository> => ({
    save: vi.fn(),
    edit: vi.fn(),
    findById: vi.fn(),
    listBetweenDates: vi.fn(),
    list: vi.fn(),
    count: vi.fn(),
    delete: vi.fn(),
  });
