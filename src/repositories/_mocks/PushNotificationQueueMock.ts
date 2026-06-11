import { IPushNotificationQueue } from '../../database/bull/pushNotifications/IPushNotificationQueue'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockPushNotificationQueue: Mocked<IPushNotificationQueue> = {
  add: vi.fn(),
  delete: vi.fn(),
}
