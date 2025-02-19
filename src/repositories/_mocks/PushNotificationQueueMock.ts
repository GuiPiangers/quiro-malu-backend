import { IPushNotificationQueue } from "../../database/bull/pushNotifications/IPushNotificationQueue";

export const createMockPushNotificationQueue: jest.Mocked<IPushNotificationQueue> =
  {
    add: jest.fn(),
    delete: jest.fn(),
  };
