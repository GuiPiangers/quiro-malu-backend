import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { GetFinanceUseCase } from "../../useCases/getFinance/getFinanceUseCase";

export class GetFinanceController {
  constructor(private getFinanceUseCase: GetFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.getFinanceUseCase.execute({
        userId,
        id,
      });

      response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
