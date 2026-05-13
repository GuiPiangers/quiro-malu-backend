import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { GetFinanceUseCase } from "../../useCases/getFinance/getFinanceUseCase";
import { FinanceIdParamSchema } from "../financeSharedSchemas";

export class GetFinanceController {
  constructor(private getFinanceUseCase: GetFinanceUseCase) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(FinanceIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { id } = parsedParams.data;
      const userId = request.user.id;

      const res = await this.getFinanceUseCase.execute({
        userId: userId!,
        id,
      });

      response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
