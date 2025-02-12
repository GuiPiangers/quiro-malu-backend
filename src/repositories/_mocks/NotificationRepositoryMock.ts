import { INotificationRepository } from "../notification/INotificationRepository";

export const createMockNotificationRepository =
  (): jest.Mocked<INotificationRepository> => ({
    delete: jest.fn(),
    get: jest.fn(),
    list: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    countNotRead: jest.fn(),
  });
