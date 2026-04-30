import { IPatientRepository } from "../patient/IPatientRepository";
import type { Mocked } from "vitest";

export const createMockPatientRepository =
  (): Mocked<IPatientRepository> => ({
    getById: vi.fn(),
    countAll: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    getByCpf: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    getByHash: vi.fn(),
    saveMany: vi.fn(),
    getByBirthMonthAndDay: vi.fn(),
    getMostRecent: vi.fn(),
    listPatientsById: vi.fn(),
    countPatientsOwnedByUser: vi.fn(),
  });
