import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { UnbindMessageSendStrategyCampaignUseCase } from "./UnbindMessageSendStrategyCampaignUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const unbindMessageSendStrategyCampaignUseCase =
  new UnbindMessageSendStrategyCampaignUseCase(messageSendStrategyRepository);

export { unbindMessageSendStrategyCampaignUseCase };
