import { deleteMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/deleteMessageSendStrategy";
import { DeleteMessageSendStrategyController } from "./DeleteMessageSendStrategyController";

const deleteMessageSendStrategyController = new DeleteMessageSendStrategyController(
  deleteMessageSendStrategyUseCase,
);

export { deleteMessageSendStrategyController };
