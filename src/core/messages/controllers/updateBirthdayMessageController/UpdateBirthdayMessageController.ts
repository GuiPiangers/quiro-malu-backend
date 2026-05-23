import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { UpdateBirthdayMessageUseCase } from '../../useCases/birthdayMessage/updateBirthdayMessage/UpdateBirthdayMessageUseCase'
import { UpdateBirthdayMessageBodySchema } from '../birthdayMessageSchemas'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class UpdateBirthdayMessageController {
  constructor(
    private updateBirthdayMessageUseCase: UpdateBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(UpdateBirthdayMessageBodySchema, request.body)
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const { id } = parsedParams.data
      const body = parsedBody.data
      const userId = request.user.id

      const res = await this.updateBirthdayMessageUseCase.execute({
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
