import { EvolutionWhatsAppProvider } from "../../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { MessageSendStrategyFactory } from "../../../sendStrategy/messageSendStrategyFactory";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { SendBeforeScheduleMessageUseCase } from "./sendBeforeScheduleMessageUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";
import { knexSchedulingRepository } from "../../../../../repositories/scheduling/knexInstances";
import { knexWhatsAppInstanceRepository, knexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/knexInstances";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";

const patientRepository = knexPatientRepository;
const schedulingRepository = knexSchedulingRepository;
const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;
const messageSendStrategyRepository = knexMessageSendStrategyRepository;
const messageSendStrategyFactory = new MessageSendStrategyFactory(
  patientRepository,
  schedulingRepository,
  whatsAppMessageLogRepository,
);
const messageSendStrategyEnforcer = new MessageSendStrategyEnforcer(
  messageSendStrategyRepository,
  messageSendStrategyFactory,
);
const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;

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