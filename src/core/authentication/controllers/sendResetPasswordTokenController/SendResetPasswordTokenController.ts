import { Request, Response } from 'express'
import { SendResetPasswordTokenUseCase } from '../../useCases/sendResetPasswordToken/SendResetPasswordToken'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { SendResetPasswordTokenBodySchema } from './sendResetPasswordTokenSchemas'

export class SendResetPasswordTokenController {
  constructor(
    private sendResetPasswordTokenUseCase: SendResetPasswordTokenUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const parsed = parseWithSchema(
        SendResetPasswordTokenBodySchema,
        request.body,
      )

      if (!parsed.success) {
        return sendZodBadRequest(response, parsed.error)
      }

      await this.sendResetPasswordTokenUseCase.execute({
        email: parsed.data.email,
        name: '',
      })

      response.status(200).json({
        message: 'Email de recuperação de senha enviado com sucesso.',
      })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
