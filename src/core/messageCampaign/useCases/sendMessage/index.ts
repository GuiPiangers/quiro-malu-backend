import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { SendMessageUseCase } from "./sendMessageUseCase";

const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();
const sendMessageUseCase = new SendMessageUseCase(
  patientRepository,
  schedulingRepository,
);

export { sendMessageUseCase };
