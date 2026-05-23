import { Request, Response } from 'express'
import { LogoutBodySchema } from './logoutSchemas'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { generateRequestFingerprint } from '../../utils/generateRequestFingerprint'
import { LogoutUseCase } from '../../useCases/logout/logoutUseCase'

export class LogoutController {
  constructor(private logoutUseCase: LogoutUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(LogoutBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const fingerprintHash = generateRequestFingerprint(request)
      await this.logoutUseCase.execute(
        parsed.data.refreshTokenId,
        fingerprintHash,
      )
      return response.status(200).json({ message: 'deslogado com sucesso' })
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
