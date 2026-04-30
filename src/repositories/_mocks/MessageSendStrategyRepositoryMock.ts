import { IMessageSendStrategyRepository } from "../messageSendStrategy/IMessageSendStrategyRepository";
import type { Mocked } from "vitest";

export const createMockMessageSendStrategyRepository =
  (): Mocked<IMessageSendStrategyRepository> => ({
    save: vi.fn(),
    listByUserIdPaged: vi.fn(),
    findByIdAndUserId: vi.fn(),
    findActiveStrategyByUserAndCampaign: vi.fn(),
    upsertCampaignBinding: vi.fn(),
    deleteCampaignBinding: vi.fn(),
    updateByIdAndUserId: vi.fn(),
    deleteByIdAndUserId: vi.fn(),
  });
