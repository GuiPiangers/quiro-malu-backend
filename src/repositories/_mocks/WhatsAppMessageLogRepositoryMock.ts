import { IWhatsAppMessageLogRepository } from "../whatsapp/IWhatsAppMessageLogRepository";

export const createMockWhatsAppMessageLogRepository =
  (): jest.Mocked<IWhatsAppMessageLogRepository> => ({
    save: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    updateByProviderMessageId: jest.fn(),
    listByUserId: jest.fn(),
    summaryByUserId: jest.fn(),
    getBySchedulingAndCampaignId: jest.fn(),
  });
