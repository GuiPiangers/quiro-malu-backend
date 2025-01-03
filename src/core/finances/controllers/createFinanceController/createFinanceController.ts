import { Request, Response } from "express";
import { CreateFinanceUseCase } from "../../useCases/createFinance/createFinanceUseCase";
import { FinanceDTO } from "../../models/Finance";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class CreateFinanceController {
  constructor(private createFinanceUseCase: CreateFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as FinanceDTO;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.createFinanceUseCase.execute({
        ...data,
        userId,
      });

      response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
