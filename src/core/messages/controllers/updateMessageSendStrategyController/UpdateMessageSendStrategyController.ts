import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  UpdateMessageSendStrategyDTO,
  UpdateMessageSendStrategyUseCase,
} from "../../useCases/messageSendStrategy/updateMessageSendStrategy/UpdateMessageSendStrategyUseCase";

export class UpdateMessageSendStrategyController {
  constructor(
    private readonly updateMessageSendStrategyUseCase: UpdateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = request.body as Pick<
        UpdateMessageSendStrategyDTO,
        "name" | "kind" | "params"
      >;
      const userId = request.user.id!;

      const res = await this.updateMessageSendStrategyUseCase.execute({
        userId,
        strategyId: id,
        ...body,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
