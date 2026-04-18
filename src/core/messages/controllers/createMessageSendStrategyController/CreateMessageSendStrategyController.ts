import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import {
  CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyUseCase,
} from "../../useCases/messageSendStrategy/createMessageSendStrategy/CreateMessageSendStrategyUseCase";

export class CreateMessageSendStrategyController {
  constructor(
    private readonly createMessageSendStrategyUseCase: CreateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as Pick<CreateMessageSendStrategyDTO, "amount">;
      const userId = request.user.id!;

      const res = await this.createMessageSendStrategyUseCase.execute({
        userId,
        amount: body.amount,
      });

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
