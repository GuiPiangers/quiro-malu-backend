import { IBeforeScheduleMessageRepository } from "../messages/IBeforeScheduleMessageRepository";
import type { Mocked } from "vitest";

export const createMockBeforeScheduleMessageRepository =
  (): Mocked<IBeforeScheduleMessageRepository> => ({
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listAll: vi.fn(),
    listByUserId: vi.fn(),
    listByUserIdPaged: vi.fn(),
    getById: vi.fn(),
  });
