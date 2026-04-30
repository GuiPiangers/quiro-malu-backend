import { IWhatsAppProvider } from "../IWhatsAppProvider";
import type { Mocked } from "vitest";

export const createMockWhatsAppProvider = (): Mocked<IWhatsAppProvider> => ({
  sendMessage: vi.fn(),
  createInstance: vi.fn(),
  getQrCode: vi.fn(),
  getConnectionState: vi.fn(),
  deleteInstance: vi.fn(),
});
