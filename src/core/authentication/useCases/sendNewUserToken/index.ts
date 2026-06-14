import { resendMailProvider } from '../../../../providers/mail/ResendMailProvider'
import { fsMailTemplateRepository } from '../../../../repositories/mailTemplate/fsInstances'
import { createChangePasswordTokenUseCase } from '../createChangePasswordToken'
import { SendNewUserTokenUseCase } from './SendNewUserTokenUseCase'

export const sendNewUserTokenUseCase = new SendNewUserTokenUseCase(
  createChangePasswordTokenUseCase,
  resendMailProvider,
  fsMailTemplateRepository,
)
