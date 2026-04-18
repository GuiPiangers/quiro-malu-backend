import { bindMessageSendStrategyCampaignsUseCase } from "../../useCases/messageSendStrategy/bindMessageSendStrategyCampaigns";
import { BindMessageSendStrategyCampaignsController } from "./BindMessageSendStrategyCampaignsController";

const bindMessageSendStrategyCampaignsController =
  new BindMessageSendStrategyCampaignsController(
    bindMessageSendStrategyCampaignsUseCase,
  );

export { bindMessageSendStrategyCampaignsController };
