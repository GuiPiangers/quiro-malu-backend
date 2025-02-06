import { IAnamnesisRepository } from "../anamnesis/IAnamnesisRepository";

export const createMockAnamnesisRepository =
  (): jest.Mocked<IAnamnesisRepository> => ({
    get: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
  });
