import { IWhatsAppInstanceRepository } from "../whatsapp/IWhatsAppInstanceRepository";
import type { Mocked } from "vitest";

export const createMockWhatsAppInstanceRepository =
  (): Mocked<IWhatsAppInstanceRepository> => ({
    save: vi.fn(),
    delete: vi.fn(),
    getByUserId: vi.fn(),
    getByInstanceName: vi.fn(),
  });
