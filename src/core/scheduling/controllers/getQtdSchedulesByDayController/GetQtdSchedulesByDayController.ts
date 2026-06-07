import { GetQtdSchedulesByDay } from '../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay'
import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import {
  QtdSchedulesMonthYearQuerySchema,
  QtdSchedulesParamsSchema,
} from '../schedulingSharedSchemas'

export class GetQtdSchedulesByDayController {
  constructor(private getQtdSchedulesUseCase: GetQtdSchedulesByDay) {}

  async handle(request: Request, response: Response) {
    const paramsParsed = parseWithSchema(
      QtdSchedulesParamsSchema,
      request.params,
    )
    if (!paramsParsed.success) {
      return sendZodBadRequest(response, paramsParsed.error)
    }

    const queryParsed = parseWithSchema(
      QtdSchedulesMonthYearQuerySchema,
      request.query,
    )
    if (!queryParsed.success) {
      return sendZodBadRequest(response, queryParsed.error)
    }

    try {
      const { userId } = paramsParsed.data
      const { month, year } = queryParsed.data
      const clinicId = request.user.clinicId as string

      const qtdSchedules = await this.getQtdSchedulesUseCase.execute({
        month,
        year,
        clinicId,
        userId,
        requestUserId: request.user.id as string,
        eventsReadScope: request.permissionScope,
      })
      response.status(200).json(qtdSchedules)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
