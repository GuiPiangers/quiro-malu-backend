import { IServiceRepository } from "../service/IServiceRepository";
import type { Mocked } from "vitest";

export const createMockServiceRepository =
  (): Mocked<IServiceRepository> => ({
    save: vi.fn(),
    update: vi.fn(),
    list: vi.fn(),
    count: vi.fn(),
    get: vi.fn(),
    getByName: vi.fn(),
    delete: vi.fn(),
  });
