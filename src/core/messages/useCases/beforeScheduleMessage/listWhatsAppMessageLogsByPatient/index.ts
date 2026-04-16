import { KnexPatientRepository } from "../../../../../repositories/patient/KnexPatientRepository";
import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { ListWhatsAppMessageLogsUseCase } from "../listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "./ListWhatsAppMessageLogsByPatientUseCase";

const patientRepository = new KnexPatientRepository();
const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();
const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);

export const listWhatsAppMessageLogsByPatientUseCase =
  new ListWhatsAppMessageLogsByPatientUseCase(
    patientRepository,
    listWhatsAppMessageLogsUseCase,
  );
