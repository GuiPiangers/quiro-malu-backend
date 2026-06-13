import { knexPasswordResetTokenRepository } from '../../../../repositories/passwordResetToken/knexInstances'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { CreateChangePasswordTokenUseCase } from './CreateChangePasswordTokenUseCase'

export const createChangePasswordTokenUseCase =
  new CreateChangePasswordTokenUseCase(
    knexUserRepository,
    knexPasswordResetTokenRepository,
  )
