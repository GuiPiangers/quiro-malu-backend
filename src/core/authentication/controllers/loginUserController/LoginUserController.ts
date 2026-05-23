import { Request, Response } from 'express'
import { LoginBodySchema } from './loginSchemas'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { generateRequestFingerprint } from '../../utils/generateRequestFingerprint'
import { LoginUserUseCase } from '../../useCases/loginUser/LoginUserUseCase'

export class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(LoginBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const { email, password } = parsed.data
      const fingerprintHash = generateRequestFingerprint(request)
      const { token, refreshToken, user } = await this.loginUserUseCase.execute(
        email,
        password,
        fingerprintHash,
      )

      return response.status(200).json({
        token: String(token).trim(),
        refreshToken: String(refreshToken).trim(),
        user,
      })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
