import { MessageCampaign, MessageCampaignDTO } from "../../models/MessageCampaign";

export type CampaignDispatchScheduler = {
  scheduleOnce(data: { campaignId: string; scheduledAt: Date }): Promise<void>;
};

export class RegisterMessageCampaignUseCase {
  constructor(private scheduler: CampaignDispatchScheduler) {}

  async execute(campaignDTO: MessageCampaignDTO) {
    if (campaignDTO.active === false) return;

    const messageCampaign = new MessageCampaign(campaignDTO);
    messageCampaign.watchTriggers();

    const campaignId = campaignDTO.id;
    if (campaignId == null) return;

    const isScheduled = campaignDTO.status === "SCHEDULED";
    const scheduledAt = campaignDTO.scheduledAt;

    if (isScheduled === false) return;
    if (scheduledAt == null) return;

    await this.scheduler.scheduleOnce({ campaignId, scheduledAt });
  }
}
