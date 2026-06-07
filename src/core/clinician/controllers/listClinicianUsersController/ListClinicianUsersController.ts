import { Request, Response } from 'express'
import { filterCliniciansByEventsReadScope } from '../../../../utils/filterCliniciansByEventsScope'
import { responseError } from '../../../../utils/ResponseError'
import { ListClinicianUsersUseCase } from '../../useCases/listClinicianUsers/ListClinicianUsersUseCase'

export class ListClinicianUsersController {
  constructor(
    private readonly listClinicianUsersUseCase: ListClinicianUsersUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const clinicId = request.user.clinicId!
      const requestUserId = request.user.id!
      const permissions = request.user.permissions ?? []
      const payload = await this.listClinicianUsersUseCase.execute(clinicId)

      return response.status(200).json({
        result: filterCliniciansByEventsReadScope({
          clinicians: payload.result,
          requestUserId,
          permissions,
        }),
      })
    } catch (err: unknown) {
      return responseError(response, err)
    }
  }
}
