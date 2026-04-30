import { ListWhatsAppMessageLogsUseCase } from "./ListWhatsAppMessageLogsUseCase";
import { knexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/knexInstances";

const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;

export const listWhatsAppMessageLogsUseCase = new ListWhatsAppMessageLogsUseCase(
  whatsAppMessageLogRepository,
);