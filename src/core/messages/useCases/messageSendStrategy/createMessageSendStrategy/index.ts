import { CreateMessageSendStrategyUseCase } from "./CreateMessageSendStrategyUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;
const patientRepository = knexPatientRepository;

const createMessageSendStrategyUseCase = new CreateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
);

export { createMessageSendStrategyUseCase };