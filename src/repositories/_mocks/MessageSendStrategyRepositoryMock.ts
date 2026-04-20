import { IMessageSendStrategyRepository } from "../messageSendStrategy/IMessageSendStrategyRepository";

export const createMockMessageSendStrategyRepository =
  (): jest.Mocked<IMessageSendStrategyRepository> => ({
    save: jest.fn(),
    listByUserIdPaged: jest.fn(),
    findByIdAndUserId: jest.fn(),
    findActiveStrategyByUserAndCampaign: jest.fn(),
    upsertCampaignBinding: jest.fn(),
    deleteByIdAndUserId: jest.fn(),
  });
