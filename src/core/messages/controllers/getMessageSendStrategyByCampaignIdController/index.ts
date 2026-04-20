import { getMessageSendStrategyByCampaignIdUseCase } from "../../useCases/messageSendStrategy/getMessageSendStrategyByCampaignId";
import { GetMessageSendStrategyByCampaignIdController } from "./GetMessageSendStrategyByCampaignIdController";

const getMessageSendStrategyByCampaignIdController =
  new GetMessageSendStrategyByCampaignIdController(
    getMessageSendStrategyByCampaignIdUseCase,
  );

export { getMessageSendStrategyByCampaignIdController };
