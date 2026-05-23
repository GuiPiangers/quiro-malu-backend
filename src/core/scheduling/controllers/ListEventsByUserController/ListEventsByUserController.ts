import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { ListEventsByUserBodySchema } from '../schedulingSharedSchemas'
import { ListEventsUseCase } from '../../useCases/listEvents/ListEventsUseCase'

export class ListEventsByUserController {
  constructor(private readonly listEventsUseCase: ListEventsUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const parsed = parseWithSchema(ListEventsByUserBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinicId = request.user.clinicId as string
      const { userId, date } = parsed.data

      const events = await this.listEventsUseCase.execute({
        date,
        clinicId,
        userId,
      })

      return response.status(200).json(events)
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
