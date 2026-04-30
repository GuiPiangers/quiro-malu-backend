import { IAfterScheduleMessageRepository } from "../messages/IAfterScheduleMessageRepository";
import type { Mocked } from "vitest";

export const createMockAfterScheduleMessageRepository =
  (): Mocked<IAfterScheduleMessageRepository> => ({
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listAll: vi.fn(),
    listByUserId: vi.fn(),
    listByUserIdPaged: vi.fn(),
    getById: vi.fn(),
  });
