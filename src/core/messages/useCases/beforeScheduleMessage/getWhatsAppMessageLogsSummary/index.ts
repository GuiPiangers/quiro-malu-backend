import { KnexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { GetWhatsAppMessageLogsSummaryUseCase } from "./GetWhatsAppMessageLogsSummaryUseCase";

const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();

export const getWhatsAppMessageLogsSummaryUseCase =
  new GetWhatsAppMessageLogsSummaryUseCase(whatsAppMessageLogRepository);
