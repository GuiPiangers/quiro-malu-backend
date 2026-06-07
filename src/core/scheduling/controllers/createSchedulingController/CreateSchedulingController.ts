import { CreateSchedulingUseCase } from '../../useCases/createScheduling/CreateSchedulingUseCase'
import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { CreateSchedulingBodySchema } from '../schedulingSharedSchemas'

export class CreateSchedulingController {
  constructor(private createScheduleUseCase: CreateSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateSchedulingBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const { userId, ...schedulingInput } = parsed.data
      const clinicId = request.user.clinicId as string

      const scheduling = await this.createScheduleUseCase.execute({
        ...schedulingInput,
        userId,
        clinicId,
        requestUserId: request.user.id as string,
        eventsWriteScope: request.permissionScope,
      })
      response.status(201).json(scheduling)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
