import { IBirthdayMessageRepository } from "../messages/IBirthdayMessageRepository";

export const createMockBirthdayMessageRepository =
  (): jest.Mocked<IBirthdayMessageRepository> => ({
    save: jest.fn(),
    findActiveByUserId: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    listByUserIdPaged: jest.fn(),
  });
