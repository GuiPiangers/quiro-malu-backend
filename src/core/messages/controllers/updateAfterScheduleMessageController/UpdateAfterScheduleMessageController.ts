import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { UpdateAfterScheduleMessageUseCase } from '../../useCases/afterScheduleMessage/updateAfterScheduleMessage/UpdateAfterScheduleMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'
import { UpdateAfterScheduleMessageBodySchema } from '../scheduledMessageSchemas'

export class UpdateAfterScheduleMessageController {
  constructor(
    private updateAfterScheduleMessageUseCase: UpdateAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(
      MessageEntityIdParamSchema,
      request.params,
    )
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(
      UpdateAfterScheduleMessageBodySchema,
      request.body,
    )
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const { id } = parsedParams.data
      const body = parsedBody.data
      const userId = request.user.id

      const res = await this.updateAfterScheduleMessageUseCase.execute({
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
