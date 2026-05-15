import { Request, Response } from "express";
import { UserIdParamsSchema } from "../../../rbac/schemas/rbacSchemas";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteClinicUserUseCase } from "../../useCases/deleteClinicUser/DeleteClinicUserUseCase";

export class DeleteClinicUserController {
  constructor(private readonly deleteClinicUserUseCase: DeleteClinicUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const parsedParams = parseWithSchema(UserIdParamsSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    try {
      const actingUserId = request.user.id!;
      const clinicId = request.user.clinicId!;
      await this.deleteClinicUserUseCase.execute({
        actingUserId,
        clinicId,
        targetUserId: parsedParams.data.id,
      });
      return response.status(204).send();
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
