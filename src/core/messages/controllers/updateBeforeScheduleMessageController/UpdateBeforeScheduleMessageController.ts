import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import {
  UpdateBeforeScheduleMessageUseCase,
} from '../../useCases/beforeScheduleMessage/updateBeforeScheduleMessage/UpdateBeforeScheduleMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'
import { UpdateBeforeScheduleMessageBodySchema } from '../scheduledMessageSchemas'

export class UpdateBeforeScheduleMessageController {
  constructor(
    private updateBeforeScheduleMessageUseCase: UpdateBeforeScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(UpdateBeforeScheduleMessageBodySchema, request.body)
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const userId = request.user.id
      const { id } = parsedParams.data
      const body = parsedBody.data

      const res = await this.updateBeforeScheduleMessageUseCase.execute({
        ...body,
        id,
        userId: userId!,
      })

      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
