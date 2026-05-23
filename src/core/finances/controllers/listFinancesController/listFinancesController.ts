import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { ListFinancesUseCase } from '../../useCases/listFinances/listFinancesUseCase'
import { ListFinancesQuerySchema } from '../financeSharedSchemas'

export class ListFinancesController {
  constructor(private listFinancesUseCase: ListFinancesUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListFinancesQuerySchema, request.query)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinicId = request.user.clinicId
      const { yearAndMonth } = parsed.data

      const res = await this.listFinancesUseCase.execute({
        clinicId: clinicId!,
        yearAndMonth,
      })

      response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
