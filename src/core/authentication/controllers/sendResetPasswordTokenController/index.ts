import { sendResetPasswordTokenUseCase } from '../../useCases/sendResetPasswordToken'
import { SendResetPasswordTokenController } from './SendResetPasswordTokenController'

export const sendResetPasswordTokenController = new SendResetPasswordTokenController(
  sendResetPasswordTokenUseCase,
)
