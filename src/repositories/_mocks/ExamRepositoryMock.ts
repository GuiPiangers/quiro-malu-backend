import { IExamsFileStorageRepository } from "../examsFileStorage/IExamsFileStorageRepository";
import { IExamsRepository } from "../examsRepository/IExamsRepository";
import type { Mocked } from "vitest";

export const createMockExamRepository = (): Mocked<IExamsRepository> => ({
  save: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
  list: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
});

export const createMockExamFileStorageRepository =
  (): Mocked<IExamsFileStorageRepository> => ({
    save: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  });
