import { IWhatsAppProvider } from "../IWhatsAppProvider";

export const createMockWhatsAppProvider = (): jest.Mocked<IWhatsAppProvider> => ({
  sendMessage: jest.fn(),
  createInstance: jest.fn(),
  getQrCode: jest.fn(),
  getConnectionState: jest.fn(),
  deleteInstance: jest.fn(),
});
