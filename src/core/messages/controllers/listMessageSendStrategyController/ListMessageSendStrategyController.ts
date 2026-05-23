import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { ListMessageSendStrategyUseCase } from '../../useCases/messageSendStrategy/listMessageSendStrategy/ListMessageSendStrategyUseCase'
import { ListPageLimitQuerySchema } from '../messagesCommonSchemas'

export class ListMessageSendStrategyController {
  constructor(
    private readonly listMessageSendStrategyUseCase: ListMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListPageLimitQuerySchema, request.query)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const userId = request.user.id!
      const { page, limit } = parsed.data

      const res = await this.listMessageSendStrategyUseCase.execute({
        userId,
        page,
        limit,
      })
      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
