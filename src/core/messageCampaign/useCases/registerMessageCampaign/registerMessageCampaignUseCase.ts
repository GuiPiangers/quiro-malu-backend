import { MessageCampaign, MessageCampaignDTO } from "../../models/MessageCampaign";

export type CampaignDispatchScheduler = {
  scheduleOnce(data: { campaignId: string; scheduledAt: Date }): Promise<void>;
  scheduleEvery7Days(data: { campaignId: string; startAt: Date }): Promise<void>;
  unscheduleEvery7Days(data: { campaignId: string }): Promise<void>;
};

export class RegisterMessageCampaignUseCase {
  constructor(private scheduler: CampaignDispatchScheduler) {}

  async execute(campaignDTO: MessageCampaignDTO) {
    const campaignId = campaignDTO.id;

    if (campaignDTO.active === false) {
      if (campaignId == null) return;
      await this.scheduler.unscheduleEvery7Days({ campaignId });
      return;
    }

    const messageCampaign = new MessageCampaign(campaignDTO);
    messageCampaign.watchTriggers();

    if (campaignId == null) return;

    const isScheduled = campaignDTO.status === "SCHEDULED";
    const scheduledAt = campaignDTO.scheduledAt;

    if (isScheduled === false) {
      await this.scheduler.unscheduleEvery7Days({ campaignId });
      return;
    }

    if (scheduledAt == null) return;

    const repeatEveryDays = campaignDTO.repeatEveryDays;

    if (repeatEveryDays === 7) {
      await this.scheduler.scheduleEvery7Days({ campaignId, startAt: scheduledAt });
      return;
    }

    await this.scheduler.scheduleOnce({ campaignId, scheduledAt });
  }
}
