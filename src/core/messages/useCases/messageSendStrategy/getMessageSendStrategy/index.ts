import { GetMessageSendStrategyUseCase } from "./GetMessageSendStrategyUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";
import { knexSchedulingRepository } from "../../../../../repositories/scheduling/knexInstances";

const messageSendStrategyRepository = knexMessageSendStrategyRepository;
const patientRepository = knexPatientRepository;
const schedulingRepository = knexSchedulingRepository;

const getMessageSendStrategyUseCase = new GetMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
  schedulingRepository,
);

export { getMessageSendStrategyUseCase };