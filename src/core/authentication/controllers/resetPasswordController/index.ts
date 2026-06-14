import { resetPasswordUseCase } from '../../useCases/resetPassword'
import { ResetPasswordController } from './ResetPasswordController'

export const resetPasswordController = new ResetPasswordController(
  resetPasswordUseCase,
)
