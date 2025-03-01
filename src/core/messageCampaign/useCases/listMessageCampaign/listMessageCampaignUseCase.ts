import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";

export class ListMessageCampaignUseCase {
  constructor(private messageCampaignRepository: IMessageCampaignRepository) {}

  async execute({ userId, page }: { userId: string; page?: number }) {
    const limit = 20;
    const offSet = page ? limit * (page - 1) : 0;

    const messageCampaignData = this.messageCampaignRepository.list({
      userId,
      config: { limit, offSet },
    });
    const totalMessageCampaign = this.messageCampaignRepository.count({
      userId,
    });

    const [messageCampaigns, total] = await Promise.all([
      messageCampaignData,
      totalMessageCampaign,
    ]);
    return { messageCampaigns, total, limit };
  }
}
