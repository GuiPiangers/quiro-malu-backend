import { Request, Response } from "express";
import { UpdateFinanceUseCase } from "../../useCases/updateFinance/updateFinanceUseCase";
import { FinanceDTO } from "../../models/Finance";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class UpdateFinanceController {
  constructor(private updateFinanceUseCase: UpdateFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as FinanceDTO & { id: string };
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.updateFinanceUseCase.execute({
        ...data,
        userId,
      });

      response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
