import { IPushNotificationProvider } from "../notification/IPushNotificationProvider";
import type { Mocked } from "vitest";

export const createMockPushNotificationProvider =
  (): Mocked<IPushNotificationProvider> => ({
    send: vi.fn(),
    subscribe: vi.fn(),
    updateSubscription: vi.fn(),
    unsubscribe: vi.fn(),
    getAllowedSubscriptions: vi.fn(),
  });
