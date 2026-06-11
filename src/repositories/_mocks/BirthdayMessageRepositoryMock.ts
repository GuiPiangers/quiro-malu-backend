import { IBirthdayMessageRepository } from '../messages/IBirthdayMessageRepository'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockBirthdayMessageRepository =
  (): Mocked<IBirthdayMessageRepository> => ({
    save: vi.fn(),
    findActiveByUserId: vi.fn(),
    findActiveCampaignForClinic: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    listByUserIdPaged: vi.fn(),
  })
