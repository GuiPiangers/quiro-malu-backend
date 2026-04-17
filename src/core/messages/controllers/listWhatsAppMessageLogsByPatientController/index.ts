import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { KnexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { ListWhatsAppMessageLogsUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogsByPatient/ListWhatsAppMessageLogsByPatientUseCase";
import { ListWhatsAppMessageLogsByPatientController } from "./ListWhatsAppMessageLogsByPatientController";

const patientRepository = new KnexPatientRepository();
const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();
const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);
const listWhatsAppMessageLogsByPatientUseCase =
  new ListWhatsAppMessageLogsByPatientUseCase(
    patientRepository,
    listWhatsAppMessageLogsUseCase,
  );

const listWhatsAppMessageLogsByPatientController =
  new ListWhatsAppMessageLogsByPatientController(
    listWhatsAppMessageLogsByPatientUseCase,
  );

export { listWhatsAppMessageLogsByPatientController };
