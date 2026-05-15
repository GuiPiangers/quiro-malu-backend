import { Request, Response } from "express";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { responseError } from "../../../../utils/ResponseError";
import { CreateRoleBodySchema } from "../../schemas/rbacSchemas";
import { CreateRoleUseCase } from "../../useCases/createRole/CreateRoleUseCase";

export class CreateRoleController {
  constructor(private useCase: CreateRoleUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateRoleBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }
    try {
      const clinicId = request.user.clinicId!;
      const role = await this.useCase.execute({
        clinicId,
        name: parsed.data.name,
        description: parsed.data.description,
      });
      return response.status(201).json(role);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
