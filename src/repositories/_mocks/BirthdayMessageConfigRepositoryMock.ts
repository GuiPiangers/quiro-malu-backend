import { IBirthdayMessageConfigRepository } from "../messageCampaign/IBirthdayMessageConfigRepository";

export const createMockBirthdayMessageConfigRepository =
  (): jest.Mocked<IBirthdayMessageConfigRepository> => ({
    get: jest.fn(),
    save: jest.fn(),
  });
