import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../sendStrategy/sendStrategyKind";
import type {
  CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyHttpBody,
} from "../../sendStrategy/messageSendStrategyKindTypeMaps";
import { CreateMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/createMessageSendStrategy/CreateMessageSendStrategyUseCase";

export class CreateMessageSendStrategyController {
  constructor(
    private readonly createMessageSendStrategyUseCase: CreateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const body = request.body as CreateMessageSendStrategyHttpBody;
      const userId = request.user.id!;

      const res = await this.createMessageSendStrategyUseCase.execute({
        userId,
        kind: body.kind ?? SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: body.params ?? {},
      } as CreateMessageSendStrategyDTO);

      return response.status(201).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
