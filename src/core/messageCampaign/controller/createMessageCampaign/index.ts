import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { CreateMessageCampaignUseCase } from "../../useCases/createMessageCampaign/createMessageCampaignUseCase";
import { CreateMessageCampaignController } from "./createMessageCampaignController";

const messageCampaignRepository = new MessageCampaignRepository();
const createMessageCampaignUseCase = new CreateMessageCampaignUseCase(
  messageCampaignRepository,
);
const createMessageCampaignController = new CreateMessageCampaignController(
  createMessageCampaignUseCase,
);

export { createMessageCampaignController };
