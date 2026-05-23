import { Request, Response } from 'express'
import { RefreshTokenUseCase } from '../../useCases/refreshToken/RefreshTokenUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { generateRequestFingerprint } from '../../utils/generateRequestFingerprint'
import { RefreshTokenBodySchema } from './refreshTokenSchemas'

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(RefreshTokenBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const fingerprintHash = generateRequestFingerprint(request)
      const result = await this.refreshTokenUseCase.execute(
        parsed.data.refreshTokenId,
        fingerprintHash,
      )
      return response.status(200).json({
        token: String(result.token).trim(),
        refreshToken: String(result.refreshToken).trim(),
      })
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
