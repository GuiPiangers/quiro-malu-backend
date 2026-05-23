import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import {
  CreateBeforeScheduleMessageDTO,
  CreateBeforeScheduleMessageUseCase,
} from '../../useCases/beforeScheduleMessage/createBeforeScheduleMessage/CreateBeforeScheduleMessageUseCase'
import { CreateBeforeScheduleMessageBodySchema } from '../scheduledMessageSchemas'

export class CreateBeforeScheduleMessageController {
  constructor(private createBeforeScheduleMessageUseCase: CreateBeforeScheduleMessageUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateBeforeScheduleMessageBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const body = parsed.data
      const userId = request.user.id

      const res = await this.createBeforeScheduleMessageUseCase.execute({
        ...body,
        userId: userId!,
      })

      return response.status(201).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
