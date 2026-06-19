import { resendMailProvider } from '../../../../providers/mail/ResendMailProvider'
import { fsMailTemplateRepository } from '../../../../repositories/mailTemplate/fsInstances'
import { createChangePasswordTokenUseCase } from '../createChangePasswordToken'
import { SendResetPasswordTokenUseCase } from './SendResetPasswordToken'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'

export const sendResetPasswordTokenUseCase = new SendResetPasswordTokenUseCase(
  createChangePasswordTokenUseCase,
  knexUserRepository,
  resendMailProvider,
  fsMailTemplateRepository,
)
