import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { GetBirthdayMessageUseCase } from '../../useCases/birthdayMessage/getBirthdayMessage/GetBirthdayMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class GetBirthdayMessageController {
  constructor(private getBirthdayMessageUseCase: GetBirthdayMessageUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { id } = parsedParams.data
      const userId = request.user.id!

      const res = await this.getBirthdayMessageUseCase.execute({
        id,
        userId,
      })

      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
