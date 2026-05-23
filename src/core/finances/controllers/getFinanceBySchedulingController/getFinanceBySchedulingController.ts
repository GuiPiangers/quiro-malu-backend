import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { ApiError } from '../../../../utils/ApiError'
import { GetFinanceBySchedulingUseCase } from '../../useCases/getFinanceByScheduling/getFinanceByScheduling'
import { FinanceSchedulingIdParamSchema } from '../financeSharedSchemas'

export class GetFinanceBySchedulingController {
  constructor(private getFinanceUseCase: GetFinanceBySchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(
      FinanceSchedulingIdParamSchema,
      request.params,
    )
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { schedulingId } = parsedParams.data
      const clinicId = request.user.clinicId

      const res = await this.getFinanceUseCase.execute({
        clinicId: clinicId!,
        schedulingId,
      })

      if (!res) { throw new ApiError('Movimentação financeira não encontrada', 404) }

      response.status(200).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
