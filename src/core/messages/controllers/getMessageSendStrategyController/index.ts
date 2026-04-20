import { getMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/getMessageSendStrategy";
import { GetMessageSendStrategyController } from "./GetMessageSendStrategyController";

const getMessageSendStrategyController = new GetMessageSendStrategyController(
  getMessageSendStrategyUseCase,
);

export { getMessageSendStrategyController };
