import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../../utils/ApiError";


export type UnbindMessageSendStrategyCampaignDTO = {
  userId: string;
  campaignId: string;
};



export class UnbindMessageSendStrategyCampaignUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: UnbindMessageSendStrategyCampaignDTO): Promise<void> {
    const campaignId = dto.campaignId

    await this.messageSendStrategyRepository.deleteCampaignBinding(
      dto.userId,
      campaignId,
    );
  }
}
