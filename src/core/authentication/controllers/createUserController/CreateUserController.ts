import { Request, Response } from "express";
import { CreateUserBodySchema } from "./createUserSchemas";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateUserBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const created = await this.createUserUseCase.execute(parsed.data);
      return response.status(201).json({
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        clinicId: created.clinicId,
        roleId: created.roleId,
      });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
