import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../../utils/ApiError";
import type { ListedMessageSendStrategyDTO } from "../listMessageSendStrategy/ListMessageSendStrategyUseCase";

export type GetMessageSendStrategyDTO = {
  userId: string;
  strategyId: string;
};

export class GetMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: GetMessageSendStrategyDTO): Promise<ListedMessageSendStrategyDTO> {
    const row = await this.messageSendStrategyRepository.findByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );

    if (!row) {
      throw new ApiError("Estratégia de envio não encontrada", 404);
    }

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      kind: row.kind,
      params: row.params,
      campaignBindingsCount: row.campaignBindingsCount,
    };
  }
}
