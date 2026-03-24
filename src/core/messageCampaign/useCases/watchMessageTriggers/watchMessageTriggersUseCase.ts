import { IMessageCampaignRepository } from "../../../../repositories/messageCampaign/IMessageCampaignRepository";
import { ApiError } from "../../../../utils/ApiError";
import { RegisterMessageCampaignUseCase } from "../registerMessageCampaign/registerMessageCampaignUseCase";

export class WatchMessageTriggersUseCase {
  private registeredCampaigns = new Set<string>();

  constructor(
    private messageCampaignRepository: IMessageCampaignRepository,
    private registerMessageCampaignUseCase: RegisterMessageCampaignUseCase,
  ) {}

  async execute() {
    const messagesCampaignsData = await this.messageCampaignRepository.listAll();

    for (const messageCampaignDTO of messagesCampaignsData) {
      if (messageCampaignDTO.id == null)
        throw new ApiError("messageCampaign.id is required", 500);

      if (this.registeredCampaigns.has(messageCampaignDTO.id)) continue;

      await this.registerMessageCampaignUseCase.execute(messageCampaignDTO);
      this.registeredCampaigns.add(messageCampaignDTO.id);
    }
  }
}
