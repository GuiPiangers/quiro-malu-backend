import { Request, Response } from "express";
import { UserIdParamsSchema } from "../../../rbac/schemas/rbacSchemas";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { GetUserUseCase } from "../../useCases/getUser/GetUserUseCase";

export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(UserIdParamsSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const user = await this.getUserUseCase.execute({
        id: parsedParams.data.id,
        clinicId: request.user.clinicId!,
      });
      return response.status(200).json(user);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}
