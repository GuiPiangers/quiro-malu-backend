import { UpdateServiceUseCase } from "../../useCases/updateService/UpdateServiceUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { UpdateServiceBodySchema } from "../serviceSharedSchemas";

export class UpdateServiceController {
  constructor(private updateServiceUseCase: UpdateServiceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(UpdateServiceBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const userId = request.user.clinicId;

      const service = await this.updateServiceUseCase.execute({
        ...data,
        userId: userId!,
      });
      response.status(201).json(service);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
