import { Request, Response } from 'express'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { responseError } from '../../../../utils/ResponseError'
import { RoleIdParamsSchema } from '../../schemas/rbacSchemas'
import { DeleteRoleUseCase } from '../../useCases/deleteRole/DeleteRoleUseCase'

export class DeleteRoleController {
  constructor(private useCase: DeleteRoleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(RoleIdParamsSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    try {
      const clinicId = request.user.clinicId!
      await this.useCase.execute({
        id: parsedParams.data.id,
        clinicId,
      })
      return response.status(204).send()
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
