import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { WatchMessageTriggersUseCase } from "./watchMessageTriggersUseCase";

const messageCampaignRepository = new MessageCampaignRepository();
const watchMessageTriggersUseCase = new WatchMessageTriggersUseCase(
  messageCampaignRepository,
);

export { watchMessageTriggersUseCase };
