import { IWhatsAppMessageLogRepository } from "../whatsapp/IWhatsAppMessageLogRepository";

export const createMockWhatsAppMessageLogRepository =
  (): jest.Mocked<IWhatsAppMessageLogRepository> => ({
    save: jest.fn(),
    updateByProviderMessageId: jest.fn(),
    listByUserId: jest.fn(),
    summaryByUserId: jest.fn(),
    getBySchedulingAndCampaignId: jest.fn(),
  });
