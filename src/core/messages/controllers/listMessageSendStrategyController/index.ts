import { listMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/listMessageSendStrategy";
import { ListMessageSendStrategyController } from "./ListMessageSendStrategyController";

const listMessageSendStrategyController = new ListMessageSendStrategyController(
  listMessageSendStrategyUseCase,
);

export { listMessageSendStrategyController };
