import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListServicesQuerySchema } from "../serviceSharedSchemas";

export class ListServiceController {
  constructor(private listServiceUseCase: ListServiceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListServicesQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const { page, search } = parsed.data;
      const userId = request.user.clinicId;

      const service = await this.listServiceUseCase.execute({
        userId: userId!,
        page,
        search,
      });
      response.status(200).json(service);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
