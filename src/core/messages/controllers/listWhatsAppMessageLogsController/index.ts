import { ListWhatsAppMessageLogsUseCase } from "../../useCases/whatsAppMessageLogs/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsController } from "./ListWhatsAppMessageLogsController";
import { knexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;
const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);

const listWhatsAppMessageLogsController = new ListWhatsAppMessageLogsController(
  listWhatsAppMessageLogsUseCase,
);

export { listWhatsAppMessageLogsController };