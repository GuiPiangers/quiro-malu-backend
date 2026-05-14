import { IClinicRepository } from "../clinic/IClinicRepository";
import type { Mocked } from "vitest";

export const createMockClinicRepository =
  (): Mocked<IClinicRepository> => ({
    save: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
  });
