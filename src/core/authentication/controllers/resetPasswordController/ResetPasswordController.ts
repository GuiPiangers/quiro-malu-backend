import { Request, Response } from 'express'
import { ResetPasswordUseCase } from '../../useCases/resetPassword/ResetPasswordUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { ResetPasswordBodySchema } from './resetPasswordSchemas'

export class ResetPasswordController {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const parsed = parseWithSchema(ResetPasswordBodySchema, request.body)

      if (!parsed.success) {
        return sendZodBadRequest(response, parsed.error)
      }

      const { token, password } = parsed.data

      await this.resetPasswordUseCase.execute({
        rawToken: token,
        newPassword: password,
      })

      return response
        .status(200)
        .json({ message: 'Senha redefinida com sucesso' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
