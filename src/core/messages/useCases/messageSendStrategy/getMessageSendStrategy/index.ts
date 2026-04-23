import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { GetMessageSendStrategyUseCase } from "./GetMessageSendStrategyUseCase";

const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();
const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();

const getMessageSendStrategyUseCase = new GetMessageSendStrategyUseCase(
  messageSendStrategyRepository,
  patientRepository,
  schedulingRepository,
);

export { getMessageSendStrategyUseCase };
