import { campaignDispatchQueue } from "../../../../queues/campaignDispatch";
import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { CreateMessageCampaignUseCase } from "../../useCases/createMessageCampaign/createMessageCampaignUseCase";
import { RegisterMessageCampaignUseCase } from "../../useCases/registerMessageCampaign/registerMessageCampaignUseCase";
import { CreateMessageCampaignController } from "./createMessageCampaignController";

const messageCampaignRepository = new MessageCampaignRepository();
const registerMessageCampaignUseCase = new RegisterMessageCampaignUseCase(
  campaignDispatchQueue,
);

const createMessageCampaignUseCase = new CreateMessageCampaignUseCase(
  messageCampaignRepository,
  registerMessageCampaignUseCase,
);

const createMessageCampaignController = new CreateMessageCampaignController(
  createMessageCampaignUseCase,
);

export { createMessageCampaignController };
