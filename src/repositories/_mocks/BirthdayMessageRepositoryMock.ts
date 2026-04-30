import { IBirthdayMessageRepository } from "../messages/IBirthdayMessageRepository";
import type { Mocked } from "vitest";

export const createMockBirthdayMessageRepository =
  (): Mocked<IBirthdayMessageRepository> => ({
    save: vi.fn(),
    findActiveByUserId: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listByUserIdPaged: vi.fn(),
  });
