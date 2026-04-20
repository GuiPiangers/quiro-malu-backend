import { updateMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/updateMessageSendStrategy";
import { UpdateMessageSendStrategyController } from "./UpdateMessageSendStrategyController";

const updateMessageSendStrategyController = new UpdateMessageSendStrategyController(
  updateMessageSendStrategyUseCase,
);

export { updateMessageSendStrategyController };
