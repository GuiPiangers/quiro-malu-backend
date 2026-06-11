import type { Mocked } from 'vitest'
import type { IClinicianRepository } from '../clinician/IClinicianRepository'
import { vi } from 'vitest'

export const createMockClinicianRepository =
  (): Mocked<IClinicianRepository> => ({
    findById: vi.fn(),
    findByClinic: vi.fn(),
    findClinicianIdsInClinic: vi.fn(),
    save: vi.fn(),
    setServices: vi.fn(),
  })
