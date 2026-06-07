import { Request, Response } from 'express'
import { EditBlockScheduleUseCase } from '../../useCases/blockScheduling/editBlockScheduling/editBlockScheduleUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import {
  BlockScheduleIdParamSchema,
  EditBlockScheduleBodySchema,
} from '../blockScheduleSchemas'

export class EditBlockScheduleController {
  constructor(private editBlockScheduleUseCase: EditBlockScheduleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(
      BlockScheduleIdParamSchema,
      request.params,
    )
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }
    const parsedBody = parseWithSchema(
      EditBlockScheduleBodySchema,
      request.body,
    )
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error)
    }

    try {
      const { id } = parsedParams.data
      const { userId, ...blockInput } = parsedBody.data
      const clinicId = request.user.clinicId as string

      await this.editBlockScheduleUseCase.execute({
        dto: { ...blockInput, id },
        userId,
        clinicId,
        requestUserId: request.user.id as string,
        eventsWriteScope: request.permissionScope,
      })

      return response.status(200).json({ message: 'Atualizado com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
