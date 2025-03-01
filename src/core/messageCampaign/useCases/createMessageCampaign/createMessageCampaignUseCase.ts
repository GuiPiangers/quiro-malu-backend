import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { MessageCampaignDTO } from "../../models/MessageCampaign";

export class CreateMessageCampaignUseCase {
  constructor(private messageCampaignRepository: MessageCampaignRepository) {}

  async execute(data: MessageCampaignDTO & { userId: string }) {
    await this.messageCampaignRepository.create(data);
  }
}
