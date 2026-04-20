import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { UpdateMessageSendStrategyUseCase } from "./UpdateMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const updateMessageSendStrategyUseCase = new UpdateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { updateMessageSendStrategyUseCase };
