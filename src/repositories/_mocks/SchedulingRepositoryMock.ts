import { ISchedulingRepository } from "../scheduling/ISchedulingRepository";

export const createMockSchedulingRepository =
  (): jest.Mocked<ISchedulingRepository> => ({
    count: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    list: jest.fn(),
    qdtSchedulesByDay: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    listBetweenDates: jest.fn(),
  });
