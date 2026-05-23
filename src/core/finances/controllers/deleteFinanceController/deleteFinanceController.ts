import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { DeleteFinanceUseCase } from '../../useCases/deleteFinance/deleteFinanceUseCase'
import { DeleteFinanceBodySchema } from '../financeSharedSchemas'

export class DeleteFinanceController {
  constructor(private deleteFinanceUseCase: DeleteFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeleteFinanceBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const { id } = parsed.data
      const clinicId = request.user.clinicId

      await this.deleteFinanceUseCase.execute({
        clinicId: clinicId!,
        id,
      })

      response.status(200).json({ message: 'Finança deletada com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
