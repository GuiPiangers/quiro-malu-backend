import { GetMessageSendStrategyByCampaignIdUseCase } from "./GetMessageSendStrategyByCampaignIdUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;

const getMessageSendStrategyByCampaignIdUseCase =
  new GetMessageSendStrategyByCampaignIdUseCase(messageSendStrategyRepository);

export { getMessageSendStrategyByCampaignIdUseCase };