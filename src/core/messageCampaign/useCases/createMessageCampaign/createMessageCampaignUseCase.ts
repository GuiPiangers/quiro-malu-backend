import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";
import {
  MessageCampaign,
  MessageCampaignDTO,
} from "../../models/MessageCampaign";
import { RegisterMessageCampaignUseCase } from "../registerMessageCampaign/registerMessageCampaignUseCase";

export class CreateMessageCampaignUseCase {
  constructor(
    private messageCampaignRepository: IMessageCampaignRepository,
    private registerMessageCampaignUseCase: RegisterMessageCampaignUseCase,
  ) {}

  async execute({ userId, ...data }: MessageCampaignDTO & { userId: string }) {
    const messageCampaign = new MessageCampaign(data);
    const messageCampaignDTO = messageCampaign.getDTO();

    const savedCampaignDTO: MessageCampaignDTO = {
      ...messageCampaignDTO,
      userId,
    };

    await this.messageCampaignRepository.create({
      ...(savedCampaignDTO as any),
      userId,
    });

    await this.registerMessageCampaignUseCase.execute(savedCampaignDTO);
  }
}
