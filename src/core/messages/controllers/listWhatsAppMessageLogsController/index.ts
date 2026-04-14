import { KnexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { ListWhatsAppMessageLogsUseCase } from "../../useCases/listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsController } from "./ListWhatsAppMessageLogsController";

const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();
const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);

const listWhatsAppMessageLogsController = new ListWhatsAppMessageLogsController(
  listWhatsAppMessageLogsUseCase,
);

export { listWhatsAppMessageLogsController };
