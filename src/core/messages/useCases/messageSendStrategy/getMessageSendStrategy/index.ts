import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { GetMessageSendStrategyUseCase } from "./GetMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();
const patientRepository = new KnexPatientRepository();

const getMessageSendStrategyUseCase = new GetMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
);

export { getMessageSendStrategyUseCase };
