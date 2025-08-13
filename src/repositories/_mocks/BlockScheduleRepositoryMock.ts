import { IBlockScheduleRepository } from "../blockScheduleRepository/IBlockScheduleRepository";

export const createMockBlockScheduleRepository =
  (): jest.Mocked<IBlockScheduleRepository> => ({
    save: jest.fn(),
    listBetweenDates: jest.fn(),
    list: jest.fn(),
    count: jest.fn(),
  });
