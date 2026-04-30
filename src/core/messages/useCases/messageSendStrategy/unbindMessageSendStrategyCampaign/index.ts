import { UnbindMessageSendStrategyCampaignUseCase } from "./UnbindMessageSendStrategyCampaignUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;

const unbindMessageSendStrategyCampaignUseCase =
  new UnbindMessageSendStrategyCampaignUseCase(messageSendStrategyRepository);

export { unbindMessageSendStrategyCampaignUseCase };