import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { CreateMessageSendStrategyUseCase } from "./CreateMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const createMessageSendStrategyUseCase = new CreateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { createMessageSendStrategyUseCase };
