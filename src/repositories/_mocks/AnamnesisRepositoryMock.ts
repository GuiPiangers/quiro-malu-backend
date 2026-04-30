import { IAnamnesisRepository } from "../anamnesis/IAnamnesisRepository";
import type { Mocked } from "vitest";

export const createMockAnamnesisRepository =
  (): Mocked<IAnamnesisRepository> => ({
    get: vi.fn(),
    update: vi.fn(),
    save: vi.fn(),
    saveMany: vi.fn(),
  });
