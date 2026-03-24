import { AudienceResolverFactory } from "../../audience/AudienceResolverFactory";
import { MessageOrigin } from "../../models/MessageLog";
import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";
import { SendMessageQueue } from "../../../../repositories/queueProvider/sendMessageQueue/sendMessageQueue";

export class DispatchMessageCampaignUseCase {
  constructor(
    private messageCampaignRepository: IMessageCampaignRepository,
    private audienceResolverFactory: AudienceResolverFactory,
    private sendMessageQueue: SendMessageQueue,
  ) {}

  async execute({ campaignId }: { campaignId: string }) {
    const campaign = await this.messageCampaignRepository.getById(campaignId);

    if (campaign == null) return;
    if (campaign.id == null) return;
    if (campaign.active === false) return;

    const userId = campaign.userId;
    if (userId == null) {
      await this.messageCampaignRepository.update(campaign.id, { status: "FAILED" });
      return;
    }

    if (campaign.status === "PROCESSING") return;

    const origin: MessageOrigin = "CAMPAIGN";

    try {
      await this.messageCampaignRepository.update(campaign.id, {
        status: "PROCESSING",
      });

      const resolver = this.audienceResolverFactory.make(campaign);
      const patients = await resolver.resolve(campaign);

      await Promise.all(
        patients
          .filter((p) => (p.id == null ? false : true))
          .map((patient) =>
            this.sendMessageQueue.add({
              userId,
              patientId: patient.id as string,
              messageCampaign: campaign,
              origin,
            }),
          ),
      );

      await this.messageCampaignRepository.update(campaign.id, {
        lastDispatchAt: new Date(),
        lastDispatchCount: patients.length,
        status: "DONE",
      });
    } catch {
      await this.messageCampaignRepository.update(campaign.id, {
        status: "FAILED",
      });
    }
  }
}
