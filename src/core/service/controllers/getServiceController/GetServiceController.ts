import { GetServiceUseCase } from '../../useCases/getService/GetServiceUseCase'
import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { ServiceIdParamSchema } from '../serviceSharedSchemas'

export class GetServiceController {
  constructor(private getServiceUseCase: GetServiceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(ServiceIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { id } = parsedParams.data
      const clinicId = request.user.clinicId

      const Service = await this.getServiceUseCase.execute({
        id,
        clinicId: clinicId!,
      })
      response.status(200).json(Service)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
