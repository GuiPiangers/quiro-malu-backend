import { EvolutionWhatsAppProvider } from "../../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { MessageSendStrategyFactory } from "../../../sendStrategy/messageSendStrategyFactory";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { SendBirthdayMessageUseCase } from "./sendBirthdayMessageUseCase";
import { knexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/knexInstances";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";
import { knexSchedulingRepository } from "../../../../../repositories/scheduling/knexInstances";
import { knexWhatsAppInstanceRepository, knexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/knexInstances";

const patientRepository = knexPatientRepository;
const schedulingRepository = knexSchedulingRepository;
const messageSendStrategyRepository = knexMessageSendStrategyRepository;
const messageSendStrategyFactory = new MessageSendStrategyFactory(
  patientRepository,
  schedulingRepository,
);
const messageSendStrategyEnforcer = new MessageSendStrategyEnforcer(
  messageSendStrategyRepository,
  messageSendStrategyFactory,
);
const whatsAppInstanceRepository = knexWhatsAppInstanceRepository;
const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;

const whatsAppProvider = new EvolutionWhatsAppProvider(
  process.env.EVOLUTION_API_BASE_URL ?? "",
  process.env.AUTHENTICATION_API_KEY ?? "",
);

const sendBirthdayMessageUseCase = new SendBirthdayMessageUseCase(
  birthdayMessageRepository,
  patientRepository,
  whatsAppProvider,
  whatsAppInstanceRepository,
  whatsAppMessageLogRepository,
  appEventListener,
  messageSendStrategyEnforcer,
);

export { sendBirthdayMessageUseCase };