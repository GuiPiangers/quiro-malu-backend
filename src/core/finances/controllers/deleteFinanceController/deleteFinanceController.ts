import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { DeleteFinanceUseCase } from "../../useCases/deleteFinance/deleteFinanceUseCase";

export class DeleteFinanceController {
  constructor(private deleteFinanceUseCase: DeleteFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.body;
      const userId = request.user.id;

      if (!userId) throw new ApiError("Usuário não autorizado", 401);

      const res = await this.deleteFinanceUseCase.execute({
        userId,
        id,
      });

      response.status(200).json({ message: "Finança deletada com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
