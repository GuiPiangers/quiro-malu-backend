import { Request, Response } from 'express'
import { DeleteServiceUseCase } from '../../useCases/deleteService/DeleteServiceUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { DeleteServiceBodySchema } from '../serviceSharedSchemas'

export class DeleteServiceController {
  constructor(private deleteServiceUseCase: DeleteServiceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeleteServiceBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinicId = request.user.clinicId
      const { id } = parsed.data
      await this.deleteServiceUseCase.execute({ id, clinicId: clinicId! })

      response.json({ message: 'Serviço deletado com sucesso!' })
    } catch (err: any) {
      responseError(response, err)
    }
  }
}
