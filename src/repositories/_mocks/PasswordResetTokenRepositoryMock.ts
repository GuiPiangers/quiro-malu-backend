import { IPasswordResetTokenRepository } from '../passwordResetToken/IPasswordResetTokenRepository'
import type { Mocked } from 'vitest'
import { vi } from 'vitest'

export const createMockPasswordResetTokenRepository =
  (): Mocked<IPasswordResetTokenRepository> => ({
    create: vi.fn(),
    findByHash: vi.fn(),
    invalidatePreviousByUserId: vi.fn(),
    markAsUsed: vi.fn(),
  })
