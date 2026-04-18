import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { DeleteMessageSendStrategyUseCase } from "./DeleteMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const deleteMessageSendStrategyUseCase = new DeleteMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { deleteMessageSendStrategyUseCase };
