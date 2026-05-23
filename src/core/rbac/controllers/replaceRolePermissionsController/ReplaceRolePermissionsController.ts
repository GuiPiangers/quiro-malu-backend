import { Request, Response } from 'express'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { responseError } from '../../../../utils/ResponseError'
import {
  ReplaceRolePermissionsBodySchema,
  RoleIdParamsSchema,
} from '../../schemas/rbacSchemas'
import type { RolePermissionItem } from '../../../../repositories/rbac/IRbacRepository'
import { ReplaceRolePermissionsUseCase } from '../../useCases/replaceRolePermissions/ReplaceRolePermissionsUseCase'

export class ReplaceRolePermissionsController {
  constructor(private useCase: ReplaceRolePermissionsUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(RoleIdParamsSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(
      ReplaceRolePermissionsBodySchema,
      request.body,
    )
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }
    try {
      const clinicId = request.user.clinicId!
      await this.useCase.execute({
        roleId: parsedParams.data.id,
        clinicId,
        items: parsedBody.data as RolePermissionItem[],
      })
      return response.status(204).send()
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
