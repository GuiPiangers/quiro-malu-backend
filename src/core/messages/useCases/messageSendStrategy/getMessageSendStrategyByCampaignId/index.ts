import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { GetMessageSendStrategyByCampaignIdUseCase } from "./GetMessageSendStrategyByCampaignIdUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const getMessageSendStrategyByCampaignIdUseCase =
  new GetMessageSendStrategyByCampaignIdUseCase(messageSendStrategyRepository);

export { getMessageSendStrategyByCampaignIdUseCase };
