import { ListMessageSendStrategyUseCase } from "./ListMessageSendStrategyUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;

const listMessageSendStrategyUseCase = new ListMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { listMessageSendStrategyUseCase };