import { Request, Response } from 'express'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { responseError } from '../../../../utils/ResponseError'
import { RoleIdParamsSchema } from '../../schemas/rbacSchemas'
import { ListRolePermissionsUseCase } from '../../useCases/listRolePermissions/ListRolePermissionsUseCase'

export class ListRolePermissionsController {
  constructor(private useCase: ListRolePermissionsUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(RoleIdParamsSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    try {
      const clinicId = request.user.clinicId!
      const items = await this.useCase.execute({
        roleId: parsedParams.data.id,
        clinicId,
      })
      return response.status(200).json(items)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
