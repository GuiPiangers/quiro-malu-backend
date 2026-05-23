import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { DeleteMessageSendStrategyUseCase } from '../../useCases/messageSendStrategy/deleteMessageSendStrategy/DeleteMessageSendStrategyUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class DeleteMessageSendStrategyController {
  constructor(
    private readonly deleteMessageSendStrategyUseCase: DeleteMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(
      MessageEntityIdParamSchema,
      request.params,
    )
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { id } = parsedParams.data
      const userId = request.user.id!

      await this.deleteMessageSendStrategyUseCase.execute({
        userId,
        strategyId: id,
      })

      return response.status(204).send()
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
