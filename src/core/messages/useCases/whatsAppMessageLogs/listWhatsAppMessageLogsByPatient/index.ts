import { ListWhatsAppMessageLogsUseCase } from "../listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "./ListWhatsAppMessageLogsByPatientUseCase";
import { knexPatientRepository } from "../../../../../repositories/patient/knexInstances";
import { knexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/knexInstances";

const patientRepository = knexPatientRepository;
const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;
const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);

export const listWhatsAppMessageLogsByPatientUseCase =
  new ListWhatsAppMessageLogsByPatientUseCase(
    patientRepository,
    listWhatsAppMessageLogsUseCase,
  );