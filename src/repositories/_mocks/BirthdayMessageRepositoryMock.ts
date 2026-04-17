import { IBirthdayMessageRepository } from "../messages/IBirthdayMessageRepository";

export const createMockBirthdayMessageRepository =
  (): jest.Mocked<IBirthdayMessageRepository> => ({
    save: jest.fn(),
    findActiveByUserId: jest.fn(),
  });
