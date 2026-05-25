import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { AddBlockSchedulingUseCase } from '../../useCases/blockScheduling/AddBlockScheduling/AddBlockSchedulingUseCase'
import { AddBlockScheduleBodySchema } from '../blockScheduleSchemas'

export class AddBlockScheduleController {
  constructor(private addBlockScheduleUseCase: AddBlockSchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(AddBlockScheduleBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const { userId, ...blockInput } = parsed.data
      const clinicId = request.user.clinicId as string

      await this.addBlockScheduleUseCase.execute({
        ...blockInput,
        userId,
        clinicId,
      })

      response.status(201).json({ message: 'Agenda bloqueada com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
