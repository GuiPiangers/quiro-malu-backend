import { Id } from "../../../../shared/Id";
import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../sendStrategy/sendStrategyKind";

export type CreateMessageSendStrategyDTO = {
  userId: string;
  amount: number;
};

export type MessageSendStrategyDTO = {
  id: string;
  userId: string;
  kind: string;
  params: { amount: number };
};

export class CreateMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: CreateMessageSendStrategyDTO): Promise<MessageSendStrategyDTO> {
    const amount = Number(dto.amount);
    if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
      throw new ApiError("amount deve ser inteiro entre 1 e 50", 400, "amount");
    }

    const id = new Id().value;
    const kind = SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS;
    const params = { amount };

    await this.messageSendStrategyRepository.save({
      id,
      userId: dto.userId,
      kind,
      params,
    });

    return { id, userId: dto.userId, kind, params };
  }
}
