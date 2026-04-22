import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { UpdateMessageSendStrategyUseCase } from "./UpdateMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();
const patientRepository = new KnexPatientRepository();

const updateMessageSendStrategyUseCase = new UpdateMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
);

export { updateMessageSendStrategyUseCase };
