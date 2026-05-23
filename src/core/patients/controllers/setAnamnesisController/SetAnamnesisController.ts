import { SetAnamnesisUseCase } from '../../useCases/anamesis/setAnamnesis/SetAnamnesisUseCase'
import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { SetAnamnesisBodySchema } from './anamnesisBodySchemas'

export class SetAnamnesisController {
  constructor(private setAnamnesisUseCase: SetAnamnesisUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(SetAnamnesisBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const data = parsed.data
      const clinicId = request.user.clinicId

      await this.setAnamnesisUseCase.execute(data, clinicId!)
      response.status(201).json({ message: 'Criado com sucesso!' })
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
