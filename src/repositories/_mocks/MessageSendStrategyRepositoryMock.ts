import { IMessageSendStrategyRepository } from "../messageSendStrategy/IMessageSendStrategyRepository";
import type { Mocked } from "vitest";

export const createMockMessageSendStrategyRepository =
  (): Mocked<IMessageSendStrategyRepository> => ({
    save: vi.fn(),
    listByUserIdPaged: vi.fn(),
    findByIdAndUserId: vi.fn(),
    findActiveStrategiesByUserAndCampaign: vi.fn(),
    setCampaignStrategyBindings: vi.fn(),
    deleteCampaignBinding: vi.fn(),
    updateByIdAndUserId: vi.fn(),
    deleteByIdAndUserId: vi.fn(),
  });
