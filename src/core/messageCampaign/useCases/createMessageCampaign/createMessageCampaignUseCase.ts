import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import {
  MessageCampaign,
  MessageCampaignDTO,
} from "../../models/MessageCampaign";

export class CreateMessageCampaignUseCase {
  constructor(private messageCampaignRepository: MessageCampaignRepository) {}

  async execute({ userId, ...data }: MessageCampaignDTO & { userId: string }) {
    const messageCampaign = new MessageCampaign(data);
    const messageCampaignDTO = messageCampaign.getDTO();

    await this.messageCampaignRepository.create({
      ...messageCampaignDTO,
      userId,
    });
  }
}
