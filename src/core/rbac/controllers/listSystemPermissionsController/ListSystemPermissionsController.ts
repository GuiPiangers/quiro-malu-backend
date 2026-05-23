import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { ListSystemPermissionsUseCase } from '../../useCases/listSystemPermissions/ListSystemPermissionsUseCase'

export class ListSystemPermissionsController {
  constructor(private useCase: ListSystemPermissionsUseCase) {}

  async handle(_request: Request, response: Response) {
    try {
      const permissions = await this.useCase.execute()
      return response.status(200).json(permissions)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
