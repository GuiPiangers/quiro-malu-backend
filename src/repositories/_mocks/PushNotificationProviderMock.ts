import { IPushNotificationProvider } from "../notification/IPushNotificationProvider";

export const createMockPushNotificationProvider =
  (): jest.Mocked<IPushNotificationProvider> => ({
    send: jest.fn(),
    subscribe: jest.fn(),
    updateSubscription: jest.fn(),
    unsubscribe: jest.fn(),
    getAllowedSubscriptions: jest.fn(),
  });
