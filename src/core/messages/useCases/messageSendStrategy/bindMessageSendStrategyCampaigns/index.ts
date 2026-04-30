import { BindMessageSendStrategyCampaignsUseCase } from "./BindMessageSendStrategyCampaignsUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;

const bindMessageSendStrategyCampaignsUseCase =
  new BindMessageSendStrategyCampaignsUseCase(messageSendStrategyRepository);

export { bindMessageSendStrategyCampaignsUseCase };