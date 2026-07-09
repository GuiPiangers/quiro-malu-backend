import { Request, Response } from 'express'
import { ApiError } from '../../../../utils/ApiError'
import { responseError } from '../../../../utils/ResponseError'
import type { GetUserProfileResponse } from './getUserProfileSchemas'
import { GetUserUseCase } from '../../useCases/getUser/GetUserUseCase'

export class GetUserProfileController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user.id
      const clinicId = request.user.clinicId
      if (!userId?.trim() || !clinicId?.trim()) {
        throw new ApiError('Acesso não autorizado', 401, 'unauthorized')
      }

      const user = await this.getUserUseCase.execute({
        id: userId,
        clinicId,
      })

      const body: GetUserProfileResponse = user
      return response.status(200).json(body)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
