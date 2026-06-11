import { ISchedulingRepository } from '../scheduling/ISchedulingRepository'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockSchedulingRepository =
  (): Mocked<ISchedulingRepository> => ({
    count: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    listIdsByClinicId: vi.fn(),
    listPatientIdsByClinicIdOrderBySchedulingCountDesc: vi.fn(),
    list: vi.fn(),
    qdtSchedulesByDay: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    listBetweenDates: vi.fn(),
  })
