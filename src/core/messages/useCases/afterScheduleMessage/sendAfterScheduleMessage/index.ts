import { EvolutionWhatsAppProvider } from "../../../../../providers/whatsapp/EvolutionWhatsAppProvider";
import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { KnexMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/KnexMessageSendStrategyRepository";
import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { KnexWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppInstanceRepository";
import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { MessageSendStrategyFactory } from "../../../sendStrategy/messageSendStrategyFactory";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { SendAfterScheduleMessageUseCase } from "./sendAfterScheduleMessageUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();
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

const sendAfterScheduleMessageUseCase = new SendAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  patientRepository,
  schedulingRepository,
  whatsAppProvider,
  whatsAppInstanceRepository,
  whatsAppMessageLogRepository,
  appEventListener,
  messageSendStrategyEnforcer,
);

export { sendAfterScheduleMessageUseCase };
