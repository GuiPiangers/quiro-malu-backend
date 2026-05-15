import { Request, Response } from "express";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { responseError } from "../../../../utils/ResponseError";
import { RoleIdParamsSchema, UpdateRoleBodySchema } from "../../schemas/rbacSchemas";
import { UpdateRoleUseCase } from "../../useCases/updateRole/UpdateRoleUseCase";

export class UpdateRoleController {
  constructor(private useCase: UpdateRoleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(RoleIdParamsSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    const parsedBody = parseWithSchema(UpdateRoleBodySchema, request.body);
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error);
    }
    try {
      const clinicId = request.user.clinicId!;
      await this.useCase.execute({
        id: parsedParams.data.id,
        clinicId,
        name: parsedBody.data.name,
        description: parsedBody.data.description,
      });
      return response.status(204).send();
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
