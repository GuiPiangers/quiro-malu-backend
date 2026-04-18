import { createMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/createMessageSendStrategy";
import { CreateMessageSendStrategyController } from "./CreateMessageSendStrategyController";

const createMessageSendStrategyController = new CreateMessageSendStrategyController(
  createMessageSendStrategyUseCase,
);

export { createMessageSendStrategyController };
