import { DeleteMessageSendStrategyUseCase } from "./DeleteMessageSendStrategyUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;

const deleteMessageSendStrategyUseCase = new DeleteMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { deleteMessageSendStrategyUseCase };