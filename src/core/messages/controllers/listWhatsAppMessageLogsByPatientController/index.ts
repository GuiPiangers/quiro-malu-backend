import { ListWhatsAppMessageLogsUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogsByPatient/ListWhatsAppMessageLogsByPatientUseCase";
import { ListWhatsAppMessageLogsByPatientController } from "./ListWhatsAppMessageLogsByPatientController";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";
import { knexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/knexInstances";

const patientRepository = knexPatientRepository;
const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;
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