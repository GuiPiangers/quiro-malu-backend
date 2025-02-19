import { IServiceRepository } from "../service/IServiceRepository";

export const createMockServiceRepository =
  (): jest.Mocked<IServiceRepository> => ({
    save: jest.fn(),
    update: jest.fn(),
    list: jest.fn(),
    count: jest.fn(),
    get: jest.fn(),
    getByName: jest.fn(),
    delete: jest.fn(),
  });
