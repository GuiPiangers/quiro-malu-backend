import { IWhatsAppProvider } from "../IWhatsAppProvider";

export const createMockWhatsAppProvider = (): jest.Mocked<IWhatsAppProvider> => ({
  sendMessage: jest.fn(),
});
