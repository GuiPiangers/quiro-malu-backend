import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { CreateMessageSendStrategyUseCase } from "./CreateMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();
const patientRepository = new KnexPatientRepository();

const createMessageSendStrategyUseCase = new CreateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
);

export { createMessageSendStrategyUseCase };
