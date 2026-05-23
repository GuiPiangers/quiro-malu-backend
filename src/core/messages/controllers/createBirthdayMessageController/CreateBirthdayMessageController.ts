import { Request, Response } from 'express'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { CreateBirthdayMessageUseCase } from '../../useCases/birthdayMessage/createBirthdayMessage/CreateBirthdayMessageUseCase'
import { CreateBirthdayMessageBodySchema } from '../birthdayMessageSchemas'

export class CreateBirthdayMessageController {
  constructor(
    private createBirthdayMessageUseCase: CreateBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateBirthdayMessageBodySchema, request.body)
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error)
    }

    try {
      const body = parsed.data
      const userId = request.user.id

      const res = await this.createBirthdayMessageUseCase.execute({
        ...body,
        userId: userId!,
      })

      return response.status(201).json(res)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
