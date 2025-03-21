import { IMessageCampaignRepository } from "../messageCampaign/IMessageCampaignRepository";

export const createMockMessageCampaignRepository =
  (): jest.Mocked<IMessageCampaignRepository> => ({
    get: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    listAll: jest.fn(),
    listNotMessagePatients: jest.fn(),
    removeNotMessagePatients: jest.fn(),
    setNotMessagePatients: jest.fn(),
  });
