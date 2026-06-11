import { ILocationRepository } from '../location/ILocationRepository'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockLocationRepository =
  (): Mocked<ILocationRepository> => ({
    getLocation: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    saveMany: vi.fn(),
  })
