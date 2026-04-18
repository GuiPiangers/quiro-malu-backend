import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

const MAX_CAMPAIGN_ID_LENGTH = 100;

export type BindMessageSendStrategyCampaignsDTO = {
  userId: string;
  strategyId: string;
  campaignIds: string[];
};

function normalizeCampaignId(raw: string): string | null {
  const id = raw.trim();
  if (!id) return null;
  if (id.length > MAX_CAMPAIGN_ID_LENGTH) {
    return null;
  }
  return id;
}

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
    for (const raw of dto.campaignIds) {
      const campaignId = normalizeCampaignId(String(raw));
      if (!campaignId) {
        throw new ApiError(
          `campaignId inválido ou muito longo (máx. ${MAX_CAMPAIGN_ID_LENGTH})`,
          400,
          "campaignIds",
        );
      }
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
