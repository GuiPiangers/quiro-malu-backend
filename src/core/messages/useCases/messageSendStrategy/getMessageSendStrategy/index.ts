import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { GetMessageSendStrategyUseCase } from "./GetMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();

const getMessageSendStrategyUseCase = new GetMessageSendStrategyUseCase(
  messageSendStrategyRepository,
);

export { getMessageSendStrategyUseCase };
