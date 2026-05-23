import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { ListWhatsAppMessageLogsUseCase } from '../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase'
import { ListWhatsAppMessageLogsQuerySchema } from '../whatsAppMessageLogsSchemas'

export class ListWhatsAppMessageLogsController {
  constructor(
    private listWhatsAppMessageLogsUseCase: ListWhatsAppMessageLogsUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListWhatsAppMessageLogsQuerySchema, request.query)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const userId = request.user.id!
      const q = parsed.data

      const res = await this.listWhatsAppMessageLogsUseCase.execute({
        userId,
        page: q.page,
        limit: q.limit,
        patientId: q.patientId,
        scheduleMessageType: q.scheduleMessageType,
        scheduleMessageConfigId: q.scheduleMessageConfigId,
        status: q.status,
      })

      return response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
