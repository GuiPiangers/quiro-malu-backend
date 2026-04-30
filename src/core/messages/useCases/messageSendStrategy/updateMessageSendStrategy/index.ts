import { UpdateMessageSendStrategyUseCase } from "./UpdateMessageSendStrategyUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;
const patientRepository = knexPatientRepository;

const updateMessageSendStrategyUseCase = new UpdateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
);

export { updateMessageSendStrategyUseCase };