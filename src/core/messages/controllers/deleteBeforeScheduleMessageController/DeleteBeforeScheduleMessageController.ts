import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { DeleteBeforeScheduleMessageUseCase } from '../../useCases/beforeScheduleMessage/deleteBeforeScheduleMessage/DeleteBeforeScheduleMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class DeleteBeforeScheduleMessageController {
  constructor(
    private deleteBeforeScheduleMessageUseCase: DeleteBeforeScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const userId = request.user.id
      const clinicId = request.user.clinicId as string
      const { id } = parsedParams.data

      await this.deleteBeforeScheduleMessageUseCase.execute({
        id,
        userId: userId!,
        clinicId,
      })

      return response.status(200).send({ message: 'Before schedule message deleted successfully' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
