import { Request, Response } from "express";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { responseError } from "../../../../utils/ResponseError";
import { PatchUserRoleBodySchema, UserIdParamsSchema } from "../../schemas/rbacSchemas";
import { PatchUserRoleUseCase } from "../../useCases/patchUserRole/PatchUserRoleUseCase";

export class PatchUserRoleController {
  constructor(private useCase: PatchUserRoleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(UserIdParamsSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    const parsedBody = parseWithSchema(PatchUserRoleBodySchema, request.body);
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error);
    }
    try {
      const clinicId = request.user.clinicId!;
      await this.useCase.execute({
        actingClinicId: clinicId,
        targetUserId: parsedParams.data.id,
        roleId: parsedBody.data.roleId,
      });
      return response.status(204).send();
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
