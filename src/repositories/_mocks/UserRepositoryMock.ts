import { IGenerateTokenProvider } from '../token/IGenerateTokenProvider'
import { IRefreshTokenProvider } from '../token/IRefreshTokenProvider'
import { IUserRepository } from '../user/IUserRepository'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockUserRepository = (): Mocked<IUserRepository> => ({
  getByEmail: vi.fn(),
  findById: vi.fn(),
  getById: vi.fn(),
  save: vi.fn(),
  listByClinicId: vi.fn(),
  deleteByIdForClinic: vi.fn(),
  updatePassword: vi.fn(),
  updatePasswordAndStatus: vi.fn(),
  activateIfPending: vi.fn(),
})

export const createMockRefreshTokenProvider =
  (): Mocked<IRefreshTokenProvider> => ({
    delete: vi.fn(),
    generate: vi.fn(),
    getRefreshToken: vi.fn(),
    markAsUsed: vi.fn(),
    deleteByFingerprint: vi.fn(),
    deleteAllFromUser: vi.fn(),
    deleteExpired: vi.fn(),
  })

export const createMockGenerateTokenProvider =
  (): Mocked<IGenerateTokenProvider> => ({
    execute: vi.fn(),
  })
