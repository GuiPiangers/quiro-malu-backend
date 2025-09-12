import { IProgressRepository } from "../progress/IProgressRepository";

export const createMockProgressRepository =
  (): jest.Mocked<IProgressRepository> => ({
    count: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getByScheduling: jest.fn(),
    list: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  });
