import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { DeleteBlockScheduleUseCase } from '../../useCases/blockScheduling/deleteBlockSchedule/deleteBlockSchedule'
import { BlockScheduleIdParamSchema } from '../blockScheduleSchemas'

export class DeleteBlockScheduleController {
  constructor(private deleteBlockScheduleUseCase: DeleteBlockScheduleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(BlockScheduleIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { id } = parsedParams.data
      const userId = request.user.id

      await this.deleteBlockScheduleUseCase.execute({ id, userId: userId! })

      return response
        .status(200)
        .json({ message: 'Evento deletado com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
