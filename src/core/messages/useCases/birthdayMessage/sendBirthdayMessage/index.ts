import { EvolutionWhatsAppProvider } from "../../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { KnexWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppInstanceRepository";
import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { MessageSendStrategyFactory } from "../../../sendStrategy/messageSendStrategyFactory";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { SendBirthdayMessageUseCase } from "./sendBirthdayMessageUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();
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
