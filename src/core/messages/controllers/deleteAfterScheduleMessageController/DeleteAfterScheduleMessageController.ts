import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { DeleteAfterScheduleMessageUseCase } from '../../useCases/afterScheduleMessage/deleteAfterScheduleMessage/DeleteAfterScheduleMessageUseCase'
import { MessageEntityIdParamSchema } from '../messagesCommonSchemas'

export class DeleteAfterScheduleMessageController {
  constructor(
    private deleteAfterScheduleMessageUseCase: DeleteAfterScheduleMessageUseCase,
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
      const userId = request.user.id!
      const clinicId = request.user.clinicId as string
      const { id } = parsedParams.data

      await this.deleteAfterScheduleMessageUseCase.execute({
        id,
        userId,
        clinicId,
      })

      return response
        .status(200)
        .json({ message: 'Mensagem de agendamento deletada com sucesso' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
