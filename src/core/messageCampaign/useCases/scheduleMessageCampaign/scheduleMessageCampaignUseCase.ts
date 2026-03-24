import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";
import { ApiError } from "../../../../utils/ApiError";
import { RegisterMessageCampaignUseCase } from "../registerMessageCampaign/registerMessageCampaignUseCase";

export class ScheduleMessageCampaignUseCase {
  constructor(
    private messageCampaignRepository: IMessageCampaignRepository,
    private registerMessageCampaignUseCase: RegisterMessageCampaignUseCase,
  ) {}

  async execute({
    campaignId,
    scheduledAt,
  }: {
    campaignId: string;
    scheduledAt: Date;
  }) {
    await this.messageCampaignRepository.update(campaignId, {
      status: "SCHEDULED",
      scheduledAt,
    });

    const updated = await this.messageCampaignRepository.getById(campaignId);

    if (updated == null) throw new ApiError("Campaign not found", 404);

    await this.registerMessageCampaignUseCase.execute(updated);
  }
}
