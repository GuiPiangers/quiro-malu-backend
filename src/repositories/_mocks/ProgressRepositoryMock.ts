import { IProgressRepository } from "../progress/IProgressRepository";
import type { Mocked } from "vitest";

export const createMockProgressRepository =
  (): Mocked<IProgressRepository> => ({
    count: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    getByScheduling: vi.fn(),
    list: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  });
