import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";
import { MessageCampaign } from "../../models/MessageCampaign";

export class WatchMessageTriggersUseCase {
  constructor(private messageCampaignRepository: IMessageCampaignRepository) {}

  async execute() {
    const messagesCampaignsData =
      await this.messageCampaignRepository.listAll();

    messagesCampaignsData.forEach((messageCampaignDTO) => {
      const messageCampaign = new MessageCampaign(messageCampaignDTO);
      messageCampaign.watchTriggers();
    });
  }
}
