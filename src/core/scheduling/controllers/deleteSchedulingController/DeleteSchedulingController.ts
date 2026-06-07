import { Request, Response } from 'express'
import { DeleteSchedulingUseCase } from '../../useCases/deleteScheduling/DeleteSchedulingUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { DeleteSchedulingBodySchema } from '../schedulingSharedSchemas'

export class DeleteSchedulingController {
  constructor(private deleteSchedulingUseCase: DeleteSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeleteSchedulingBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const requestUserId = request.user.id as string
      const clinicId = request.user.clinicId as string
      const { id } = parsed.data

      await this.deleteSchedulingUseCase.execute({
        id,
        userId: requestUserId,
        clinicId,
        requestUserId,
        eventsWriteScope: request.permissionScope,
      })

      response.json({ message: 'Paciente deletado com sucesso!' })
    } catch (err: any) {
      responseError(response, err)
    }
  }
}
