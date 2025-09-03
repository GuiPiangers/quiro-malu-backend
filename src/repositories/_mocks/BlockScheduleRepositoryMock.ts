import { IBlockScheduleRepository } from "../blockScheduleRepository/IBlockScheduleRepository";

export const createMockBlockScheduleRepository =
  (): jest.Mocked<IBlockScheduleRepository> => ({
    save: jest.fn(),
    edit: jest.fn(),
    findById: jest.fn(),
    listBetweenDates: jest.fn(),
    list: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  });
