import { IAfterScheduleMessageRepository } from "../messages/IAfterScheduleMessageRepository";

export const createMockAfterScheduleMessageRepository =
  (): jest.Mocked<IAfterScheduleMessageRepository> => ({
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    listAll: jest.fn(),
    listByUserId: jest.fn(),
    getById: jest.fn(),
  });
