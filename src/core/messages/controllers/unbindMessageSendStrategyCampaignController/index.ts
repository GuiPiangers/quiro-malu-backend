import { unbindMessageSendStrategyCampaignUseCase } from "../../useCases/messageSendStrategy/unbindMessageSendStrategyCampaign";
import { UnbindMessageSendStrategyCampaignController } from "./UnbindMessageSendStrategyCampaignController";

const unbindMessageSendStrategyCampaignController =
  new UnbindMessageSendStrategyCampaignController(
    unbindMessageSendStrategyCampaignUseCase,
  );

export { unbindMessageSendStrategyCampaignController };
