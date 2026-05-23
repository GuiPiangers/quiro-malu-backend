import type { Mocked } from 'vitest'
import type { IClinicianRepository } from '../clinician/IClinicianRepository'

export const createMockClinicianRepository =
  (): Mocked<IClinicianRepository> => ({
    findById: vi.fn(),
    findByClinic: vi.fn(),
    save: vi.fn(),
    setServices: vi.fn(),
  })
