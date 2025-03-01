import { MessageCampaignRepository } from "../../../../repositories/messageCampaign/MessageCampaignRepository";
import { ListMessageCampaignUseCase } from "../../useCases/listMessageCampaign/listMessageCampaignUseCase";
import { ListMessageCampaignController } from "./listMessageCampaignController";

const messageCampaignRepository = new MessageCampaignRepository();
const listMessageCampaignUseCase = new ListMessageCampaignUseCase(
  messageCampaignRepository,
);
const listMessageCampaignController = new ListMessageCampaignController(
  listMessageCampaignUseCase,
);

export { listMessageCampaignController };
