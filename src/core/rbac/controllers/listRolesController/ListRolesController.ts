import { Request, Response } from "express";
import { ListRolesUseCase } from "../../useCases/listRoles/ListRolesUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class ListRolesController {
  constructor(private useCase: ListRolesUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const clinicId = request.user.clinicId!;
      const roles = await this.useCase.execute(clinicId);
      return response.status(200).json(roles);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
