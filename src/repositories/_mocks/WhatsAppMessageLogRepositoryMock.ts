import { IWhatsAppMessageLogRepository } from "../whatsapp/IWhatsAppMessageLogRepository";
import type { Mocked } from "vitest";

export const createMockWhatsAppMessageLogRepository =
  (): Mocked<IWhatsAppMessageLogRepository> => ({
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(null),
    updateByProviderMessageId: vi.fn(),
    listByUserId: vi.fn(),
    summaryByUserId: vi.fn(),
    getBySchedulingAndCampaignId: vi.fn(),
  });
