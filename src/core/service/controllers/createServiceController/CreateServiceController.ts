import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { CreateServiceBodySchema } from "../serviceSharedSchemas";

export class CreateServiceController {
  constructor(private createServiceUseCase: CreateServiceUseCase) {}
  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(CreateServiceBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const userId = request.user.clinicId;

      const service = await this.createServiceUseCase.execute({
        ...data,
        userId: userId!,
      });
      response.status(201).json(service);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
