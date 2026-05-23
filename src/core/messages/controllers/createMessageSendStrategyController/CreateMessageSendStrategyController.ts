import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { buildValidatedCreateMessageSendStrategyDTO } from '../../http/validateMessageSendStrategyHttpInput'
import type { CreateMessageSendStrategyHttpBody } from '../../sendStrategy/messageSendStrategyKindTypeMaps'
import { CreateMessageSendStrategyUseCase } from '../../useCases/messageSendStrategy/createMessageSendStrategy/CreateMessageSendStrategyUseCase'
import { CreateMessageSendStrategyBodySchema } from '../messageSendStrategyHttpSchemas'

export class CreateMessageSendStrategyController {
  constructor(
    private readonly createMessageSendStrategyUseCase: CreateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(
      CreateMessageSendStrategyBodySchema,
      request.body,
    )
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const body = parsed.data
      const userId = request.user.id!
      const clinicId = request.user.clinicId!

      const dto = buildValidatedCreateMessageSendStrategyDTO(
        userId,
        clinicId,
        body as CreateMessageSendStrategyHttpBody,
      )
      const res = await this.createMessageSendStrategyUseCase.execute(dto)

      return response.status(201).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
