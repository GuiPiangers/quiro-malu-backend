import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { GetBeforeScheduleMessageUseCase } from '../../useCases/beforeScheduleMessage/getBeforeScheduleMessage/GetBeforeScheduleMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class GetBeforeScheduleMessageController {
  constructor(private getBeforeScheduleMessageUseCase: GetBeforeScheduleMessageUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const userId = request.user.id
      const { id } = parsedParams.data

      const res = await this.getBeforeScheduleMessageUseCase.execute({
        id,
        userId: userId!,
      })

      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
