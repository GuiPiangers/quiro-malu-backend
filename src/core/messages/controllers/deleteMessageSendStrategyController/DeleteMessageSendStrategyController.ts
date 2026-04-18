import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { DeleteMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/deleteMessageSendStrategy/DeleteMessageSendStrategyUseCase";

export class DeleteMessageSendStrategyController {
  constructor(
    private readonly deleteMessageSendStrategyUseCase: DeleteMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id!;

      await this.deleteMessageSendStrategyUseCase.execute({
        userId,
        strategyId: id,
      });

      return response.status(204).send();
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
