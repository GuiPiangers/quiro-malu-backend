import { EvolutionWhatsAppProvider } from "../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { MessageLogRepository } from "../../../../repositories/messageCampaign/MessageLogRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { SendMessageUseCase } from "./sendMessageUseCase";

const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();
const messageLogRepository = new MessageLogRepository();

const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.EVOLUTION_API_KEY ?? "",
);

const sendMessageUseCase = new SendMessageUseCase(
  patientRepository,
  schedulingRepository,
  whatsAppProvider,
  messageLogRepository,
  process.env.EVOLUTION_API_INSTANCE ?? "",
);

export { sendMessageUseCase };
