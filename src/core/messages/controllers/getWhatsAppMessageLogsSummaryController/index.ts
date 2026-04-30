import { GetWhatsAppMessageLogsSummaryUseCase } from "../../useCases/whatsAppMessageLogs/getWhatsAppMessageLogsSummary/GetWhatsAppMessageLogsSummaryUseCase";
import { GetWhatsAppMessageLogsSummaryController } from "./GetWhatsAppMessageLogsSummaryController";
import { knexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;
const getWhatsAppMessageLogsSummaryUseCase =
  new GetWhatsAppMessageLogsSummaryUseCase(whatsAppMessageLogRepository);

const getWhatsAppMessageLogsSummaryController =
  new GetWhatsAppMessageLogsSummaryController(
    getWhatsAppMessageLogsSummaryUseCase,
  );

export { getWhatsAppMessageLogsSummaryController };