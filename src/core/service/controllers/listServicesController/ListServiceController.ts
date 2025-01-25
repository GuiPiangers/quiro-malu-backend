import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class ListServiceController {
  constructor(private listServiceUseCase: ListServiceUseCase) {}
  async handle(request: Request, response: Response) {
    try {
      const { page } = request.query;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Acesso não autorizado", 401);

      const service = await this.listServiceUseCase.execute({
        userId,
        page: page ? +page : 1,
      });
      response.status(200).json(service);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
