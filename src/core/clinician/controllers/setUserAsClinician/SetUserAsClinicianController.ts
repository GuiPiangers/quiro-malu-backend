import { Request, Response } from 'express'
import { SetUserAsClinicianUseCase } from '../../useCases/setUserAsClinician/SetUserAsClinicianUseCase'
import { responseError } from '../../../../utils/ResponseError'

export class SetUserAsClinicianController {
  constructor(private setUserAsClinicianUseCase: SetUserAsClinicianUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { userId } = request.body
      const clinicId = request.user.clinicId!

      await this.setUserAsClinicianUseCase.execute({ userId }, clinicId)
      response.status(204).send()
    } catch (err: any) {
      return responseError(response, err)
    }
  }
}
