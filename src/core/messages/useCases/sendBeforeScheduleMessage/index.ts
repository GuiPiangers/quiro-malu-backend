import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { SendBeforeScheduleMessageUseCase } from "./sendBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();
const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();

const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.EVOLUTION_API_KEY ?? "",
  process.env.EVOLUTION_API_INSTANCE ?? "",
);

const sendBeforeScheduleMessageUseCase = new SendBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  patientRepository,
  schedulingRepository,
  whatsAppProvider,
);

export { sendBeforeScheduleMessageUseCase };
