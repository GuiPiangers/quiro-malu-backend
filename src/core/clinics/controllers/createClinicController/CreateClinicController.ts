import { Request, Response } from 'express'
import { CreateClinicUseCase } from '../../useCases/createClinic/CreateClinicUseCase'
import { responseError } from '../../../../utils/ResponseError'
import {
  parseWithSchema,
  sendZodBadRequest,
} from '../../../../utils/zodValidation'
import { CreateClinicBodySchema } from './createClinicSchemas'

export class CreateClinicController {
  constructor(private createClinicUseCase: CreateClinicUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateClinicBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const clinic = await this.createClinicUseCase.execute(parsed.data)
      return response.status(201).json(clinic)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
