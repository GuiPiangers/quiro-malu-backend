import { campaignDispatchQueue } from "../../../../queues/campaignDispatch";
import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { RegisterMessageCampaignUseCase } from "../registerMessageCampaign/registerMessageCampaignUseCase";
import { WatchMessageTriggersUseCase } from "./watchMessageTriggersUseCase";

const messageCampaignRepository = new MessageCampaignRepository();
const registerMessageCampaignUseCase = new RegisterMessageCampaignUseCase(
  campaignDispatchQueue,
);

const watchMessageTriggersUseCase = new WatchMessageTriggersUseCase(
  messageCampaignRepository,
  registerMessageCampaignUseCase,
);

export { watchMessageTriggersUseCase };
