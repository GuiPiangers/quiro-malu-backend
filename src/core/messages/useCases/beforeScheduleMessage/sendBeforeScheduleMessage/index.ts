import { EvolutionWhatsAppProvider } from "../../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { BeforeScheduleMessageRepository } from "../../../../../repositories/messages/BeforeScheduleMessageRepository";
import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { KnexWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppInstanceRepository";
import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { MessageSendStrategyFactory } from "../../../sendStrategy/messageSendStrategyFactory";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { SendBeforeScheduleMessageUseCase } from "./sendBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();
const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();
const messageSendStrategyRepository = new KnexMessageSendStrategyRepository();
const messageSendStrategyFactory = new MessageSendStrategyFactory();
const messageSendStrategyEnforcer = new MessageSendStrategyEnforcer(
  messageSendStrategyRepository,
  messageSendStrategyFactory,
  patientRepository,
  schedulingRepository,
);
const whatsAppInstanceRepository = new KnexWhatsAppInstanceRepository();
const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();

const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const sendBeforeScheduleMessageUseCase = new SendBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  patientRepository,
  schedulingRepository,
  whatsAppProvider,
  whatsAppInstanceRepository,
  whatsAppMessageLogRepository,
  appEventListener,
  messageSendStrategyEnforcer,
);

export { sendBeforeScheduleMessageUseCase };
