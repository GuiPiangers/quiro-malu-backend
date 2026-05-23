import { Request, Response } from 'express'
import { ApiError } from '../../../../utils/ApiError'
import { responseError } from '../../../../utils/ResponseError'
import { ListUsersUseCase } from '../../useCases/listUsers/ListUsersUseCase'

export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const clinicId = request.user.clinicId
      if (!clinicId?.trim()) {
        throw new ApiError('Acesso não autorizado', 401, 'unauthorized')
      }

      const users = await this.listUsersUseCase.execute(clinicId)
      return response.status(200).json(users)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
