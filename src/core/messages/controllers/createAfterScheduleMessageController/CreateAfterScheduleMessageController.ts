import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { CreateAfterScheduleMessageUseCase } from '../../useCases/afterScheduleMessage/createAfterScheduleMessage/CreateAfterScheduleMessageUseCase'
import { CreateAfterScheduleMessageBodySchema } from '../scheduledMessageSchemas'

export class CreateAfterScheduleMessageController {
  constructor(
    private createAfterScheduleMessageUseCase: CreateAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(
      CreateAfterScheduleMessageBodySchema,
      request.body,
    )
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const body = parsed.data
      const userId = request.user.id

      const res = await this.createAfterScheduleMessageUseCase.execute({
        ...body,
        userId: userId!,
      })

      return response.status(201).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
