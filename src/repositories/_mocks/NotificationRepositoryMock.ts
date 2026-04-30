import { INotificationRepository } from "../notification/INotificationRepository";
import type { Mocked } from "vitest";

export const createMockNotificationRepository =
  (): Mocked<INotificationRepository> => ({
    delete: vi.fn(),
    get: vi.fn(),
    list: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    countNotReadOrNeedAct: vi.fn(),
    deleteMany: vi.fn(),
  });
