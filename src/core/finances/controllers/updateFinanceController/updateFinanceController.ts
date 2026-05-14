import { Request, Response } from "express";
import { UpdateFinanceUseCase } from "../../useCases/updateFinance/updateFinanceUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { UpdateFinanceBodySchema } from "../financeSharedSchemas";

export class UpdateFinanceController {
  constructor(private updateFinanceUseCase: UpdateFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(UpdateFinanceBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const userId = request.user.clinicId;

      await this.updateFinanceUseCase.execute({
        ...data,
        userId: userId!,
      });

      response.status(200).json({ message: "Finança atualizada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
