import { IBeforeScheduleMessageRepository } from "../messages/IBeforeScheduleMessageRepository";

export const createMockBeforeScheduleMessageRepository =
  (): jest.Mocked<IBeforeScheduleMessageRepository> => ({
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    listAll: jest.fn(),
    listByUserId: jest.fn(),
    listByUserIdPaged: jest.fn(),
    getById: jest.fn(),
  });
