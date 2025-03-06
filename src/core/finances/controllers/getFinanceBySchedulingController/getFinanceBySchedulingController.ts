import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { GetFinanceBySchedulingUseCase } from "../../useCases/getFinanceByScheduling/getFinanceByScheduling";

export class GetFinanceBySchedulingController {
  constructor(private getFinanceUseCase: GetFinanceBySchedulingUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { schedulingId } = request.params;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.getFinanceUseCase.execute({
        userId,
        schedulingId,
      });

      if (!res)
        throw new ApiError("Movimentação financeira não encontrada", 401);

      response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
