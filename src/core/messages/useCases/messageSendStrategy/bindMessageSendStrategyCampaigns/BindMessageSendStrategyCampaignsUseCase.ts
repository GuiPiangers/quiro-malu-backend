import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

export type BindMessageSendStrategyCampaignsDTO = {
  userId: string;
  campaignId: string;
  strategyIds: string[];
};

export class BindMessageSendStrategyCampaignsUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: BindMessageSendStrategyCampaignsDTO): Promise<void> {
    if (!dto.strategyIds?.length) {
      throw new ApiError(
        "strategyIds deve ter ao menos um item",
        400,
        "strategyIds",
      );
    }

    const seen = new Set<string>();
    const uniqueStrategyIds: string[] = [];
    for (const strategyId of dto.strategyIds) {
      if (seen.has(strategyId)) {
        continue;
      }
      seen.add(strategyId);
      uniqueStrategyIds.push(strategyId);
    }

    for (const strategyId of uniqueStrategyIds) {
      const strategy = await this.messageSendStrategyRepository.findByIdAndUserId(
        strategyId,
        dto.userId,
      );
      if (!strategy) {
        throw new ApiError("Estratégia não encontrada", 404);
      }
    }

    await this.messageSendStrategyRepository.setCampaignStrategyBindings(
      dto.userId,
      dto.campaignId,
      uniqueStrategyIds,
    );
  }
}
