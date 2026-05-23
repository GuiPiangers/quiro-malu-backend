import { UpdateSchedulingUseCase } from '../../useCases/updateScheduling/UpdateSchedulingUseCase'
import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { UpdateSchedulingBodySchema } from '../schedulingSharedSchemas'

export class UpdateSchedulingController {
  constructor(private updateSchedulingUseCase: UpdateSchedulingUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(UpdateSchedulingBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinicId = request.user.clinicId as string
      const requestUserId = request.user.id as string

      const scheduling = await this.updateSchedulingUseCase.execute({
        ...parsed.data,
        clinicId,
        requestUserId,
      })

      response.status(201).json(scheduling)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
