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
    repeatEveryDays,
  }: {
    campaignId: string;
    scheduledAt: Date;
    repeatEveryDays?: number;
  }) {
    await this.messageCampaignRepository.update(campaignId, {
      status: "SCHEDULED",
      scheduledAt,
      repeatEveryDays,
    });

    const updated = await this.messageCampaignRepository.getById(campaignId);

    if (updated == null) throw new ApiError("Campaign not found", 404);

    await this.registerMessageCampaignUseCase.execute(updated);
  }
}
