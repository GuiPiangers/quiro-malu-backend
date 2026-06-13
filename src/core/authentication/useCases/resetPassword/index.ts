import { knexPasswordResetTokenRepository } from '../../../../repositories/passwordResetToken/knexInstances'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { ResetPasswordUseCase } from './ResetPasswordUseCase'

export const resetPasswordUseCase = new ResetPasswordUseCase(
  knexUserRepository,
  knexPasswordResetTokenRepository,
)
