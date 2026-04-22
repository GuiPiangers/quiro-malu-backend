import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { buildValidatedCreateMessageSendStrategyDTO } from "../../http/validateMessageSendStrategyHttpInput";
import { CreateMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/createMessageSendStrategy/CreateMessageSendStrategyUseCase";
import type { CreateMessageSendStrategyHttpBody } from "../../sendStrategy/messageSendStrategyKindTypeMaps";

export class CreateMessageSendStrategyController {
  constructor(
    private readonly createMessageSendStrategyUseCase: CreateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as CreateMessageSendStrategyHttpBody;
      const userId = request.user.id!;

      const dto = buildValidatedCreateMessageSendStrategyDTO(userId, body);
      const res = await this.createMessageSendStrategyUseCase.execute(dto);

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
