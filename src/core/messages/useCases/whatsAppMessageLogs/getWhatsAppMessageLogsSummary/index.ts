import { GetWhatsAppMessageLogsSummaryUseCase } from "./GetWhatsAppMessageLogsSummaryUseCase";
import { knexWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/knexInstances";

const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;

export const getWhatsAppMessageLogsSummaryUseCase =
  new GetWhatsAppMessageLogsSummaryUseCase(whatsAppMessageLogRepository);