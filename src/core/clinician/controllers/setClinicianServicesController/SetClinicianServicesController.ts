import { Request, Response } from 'express'
import { UserIdParamsSchema } from '../../../rbac/schemas/rbacSchemas'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { SetClinicianServicesUseCase } from '../../useCases/setClinicianServices/SetClinicianServicesUseCase'
import { SetClinicianServicesBodySchema } from './setClinicianServicesSchemas'

export class SetClinicianServicesController {
  constructor(
    private readonly setClinicianServicesUseCase: SetClinicianServicesUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(UserIdParamsSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    const parsedBody = parseWithSchema(
      SetClinicianServicesBodySchema,
      request.body,
    )

    console.log('parsedBody', parsedBody)

    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const updated = await this.setClinicianServicesUseCase.execute(
        {
          clinicianId: parsedParams.data.id,
          services: parsedBody.data.services,
        },
        request.user.clinicId!,
      )
      return response.status(200).json(updated)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
