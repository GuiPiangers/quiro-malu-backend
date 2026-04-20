import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { GetMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/getMessageSendStrategy/GetMessageSendStrategyUseCase";

export class GetMessageSendStrategyController {
  constructor(
    private readonly getMessageSendStrategyUseCase: GetMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      const res = await this.getMessageSendStrategyUseCase.execute({
        userId,
        strategyId: id,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
