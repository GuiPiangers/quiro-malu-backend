import { Request, Response } from "express";
import { SetFinanceUseCase } from "../../useCases/setFinance/setFinanceUseCase";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { SetFinanceBodySchema } from "../financeSharedSchemas";

export class SetFinanceController {
  constructor(private setFinanceUseCase: SetFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(SetFinanceBodySchema, request.body);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const data = parsed.data;
      const userId = request.user.id;

      await this.setFinanceUseCase.execute({
        ...data,
        userId: userId!,
      });

      response.status(201).json({ message: "Finance criada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
