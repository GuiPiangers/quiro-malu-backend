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
      const userId = request.user.id
      const clinicId = request.user.clinicId as string
      const data = parsedBody.data

      await this.editBlockScheduleUseCase.execute(
        { ...data, id },
        userId!,
        clinicId,
      )

      return response.status(200).json({ message: 'Atualizado com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
