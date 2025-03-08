import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { SendMessageUseCase } from "./sendMessageUseCase";

const patientRepository = new KnexPatientRepository();
const schedulingRepository = new MySqlSchedulingRepository();
const sendMessageUseCase = new SendMessageUseCase(
  patientRepository,
  schedulingRepository,
);

export { sendMessageUseCase };
