import { Request, Response } from 'express'
import { GetPatientUseCase } from '../../useCases/getPatient/GetPatientUseCase'
import { responseError } from '../../../../utils/ResponseError'
import { parseWithSchema, sendZodBadRequest } from '../../../../utils/zodValidation'
import { PatientIdParamSchema } from '../patientSharedSchemas'

export class GetPatientController {
  constructor(private listPatientsUseCase: GetPatientUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(PatientIdParamSchema, request.params)
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error)
    }

    try {
      const clinicId = request.user.clinicId!
      const { id: patientId } = parsedParams.data
      const patients = await this.listPatientsUseCase.execute(
        patientId,
        clinicId,
      )

      response.json(patients)
    } catch (err: any) {
      responseError(response, err)
    }
  }
}
