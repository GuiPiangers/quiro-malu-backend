import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { ListMessageSendStrategyUseCase } from "./ListMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const listMessageSendStrategyUseCase = new ListMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { listMessageSendStrategyUseCase };
