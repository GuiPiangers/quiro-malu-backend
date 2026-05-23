import { Request, Response } from 'express'
import { responseError } from '../../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../../utils/zodValidation'
import { GetProgressBySchedulingUseCase } from '../../../useCases/progress/getProgressByScheduling/GetProgressBySchedulingUseCase'
import { ProgressBySchedulingParamsSchema } from '../progressBodySchemas'

export class GetProgressBySchedulingController {
  constructor(private getProgressUseCase: GetProgressBySchedulingUseCase) {}
  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(
      ProgressBySchedulingParamsSchema,
      request.params,
    )
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const { schedulingId, patientId } = parsedParams.data
      const clinicId = request.user.clinicId!

      const progress = await this.getProgressUseCase.execute({
        schedulingId,
        patientId,
        clinicId,
      })

      response.status(200).json(progress)
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
