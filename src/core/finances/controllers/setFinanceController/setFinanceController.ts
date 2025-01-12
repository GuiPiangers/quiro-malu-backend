import { Request, Response } from "express";
import { SetFinanceUseCase } from "../../useCases/setFinance/setFinanceUseCase";
import { FinanceDTO } from "../../models/Finance";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class SetFinanceController {
  constructor(private setFinanceUseCase: SetFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const data = request.body as FinanceDTO;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      await this.setFinanceUseCase.execute({
        ...data,
        userId,
      });

      response.status(201).json({ message: "Finance criada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
