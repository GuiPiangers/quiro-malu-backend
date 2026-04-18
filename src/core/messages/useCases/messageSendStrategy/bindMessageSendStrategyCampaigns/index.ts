import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { BindMessageSendStrategyCampaignsUseCase } from "./BindMessageSendStrategyCampaignsUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const bindMessageSendStrategyCampaignsUseCase =
  new BindMessageSendStrategyCampaignsUseCase(messageSendStrategyRepository);

export { bindMessageSendStrategyCampaignsUseCase };
