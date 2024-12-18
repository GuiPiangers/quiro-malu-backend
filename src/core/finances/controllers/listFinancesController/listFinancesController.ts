import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { ListFinancesUseCase } from "../../useCases/listFinances/listFinancesUseCase";

export class ListFinancesController {
  constructor(private listFinancesUseCase: ListFinancesUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.listFinancesUseCase.execute({
        userId,
      });

      response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
