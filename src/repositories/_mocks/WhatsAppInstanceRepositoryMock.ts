import { IWhatsAppInstanceRepository } from "../whatsapp/IWhatsAppInstanceRepository";

export const createMockWhatsAppInstanceRepository =
  (): jest.Mocked<IWhatsAppInstanceRepository> => ({
    save: jest.fn(),
    delete: jest.fn(),
    getByUserId: jest.fn(),
    getByInstanceName: jest.fn(),
  });
