import { Request, Response } from 'express'
import { DeleteProgressUseCase } from '../../../useCases/progress/deleteProgress/DeleteProgressUseCase'
import { responseError } from '../../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../../utils/zodValidation'
import { DeleteProgressBodySchema } from '../progressBodySchemas'

export class DeleteProgressController {
  constructor(private deleteProgressUseCase: DeleteProgressUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(DeleteProgressBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinicId = request.user.clinicId!
      const { id, patientId } = parsed.data
      await this.deleteProgressUseCase.execute({
        id,
        patientId,
        clinicId,
      })

      response.json({ message: 'Paciente deletado com sucesso!' })
    } catch (err: any) {
      responseError(response, err)
    }
  }
}
