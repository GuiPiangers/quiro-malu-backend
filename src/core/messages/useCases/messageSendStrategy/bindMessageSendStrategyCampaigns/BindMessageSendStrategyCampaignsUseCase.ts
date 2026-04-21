import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

export type BindMessageSendStrategyCampaignsDTO = {
  userId: string;
  strategyId: string;
  campaignIds: string[];
};
export class BindMessageSendStrategyCampaignsUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: BindMessageSendStrategyCampaignsDTO): Promise<void> {
    const strategy = await this.messageSendStrategyRepository.findByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );

    if (!strategy) {
      throw new ApiError("Estratégia não encontrada", 404);
    }

    if (!dto.campaignIds?.length) {
      throw new ApiError(
        "campaignIds deve ter ao menos um item",
        400,
        "campaignIds",
      );
    }

    const seen = new Set<string>();
    for (const campaignId of dto.campaignIds) {
      if (seen.has(campaignId)) {
        continue;
      }
      seen.add(campaignId);
      await this.messageSendStrategyRepository.upsertCampaignBinding(
        dto.userId,
        campaignId,
        dto.strategyId,
      );
    }
  }
}
