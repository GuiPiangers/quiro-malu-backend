import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ListClinicianUsersUseCase } from "../../useCases/listClinicianUsers/ListClinicianUsersUseCase";

export class ListClinicianUsersController {
  constructor(
    private readonly listClinicianUsersUseCase: ListClinicianUsersUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const clinicId = request.user.clinicId!;
      const payload = await this.listClinicianUsersUseCase.execute(clinicId);
      return response.status(200).json(payload);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
