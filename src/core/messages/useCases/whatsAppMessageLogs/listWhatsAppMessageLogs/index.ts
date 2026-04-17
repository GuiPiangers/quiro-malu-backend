import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { ListWhatsAppMessageLogsUseCase } from "./ListWhatsAppMessageLogsUseCase";

const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();

export const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);
