import { KnexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { GetWhatsAppMessageLogsSummaryUseCase } from "../../useCases/whatsAppMessageLogs/getWhatsAppMessageLogsSummary/GetWhatsAppMessageLogsSummaryUseCase";
import { GetWhatsAppMessageLogsSummaryController } from "./GetWhatsAppMessageLogsSummaryController";

const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();
const getWhatsAppMessageLogsSummaryUseCase =
  new GetWhatsAppMessageLogsSummaryUseCase(whatsAppMessageLogRepository);

const getWhatsAppMessageLogsSummaryController =
  new GetWhatsAppMessageLogsSummaryController(
    getWhatsAppMessageLogsSummaryUseCase,
  );

export { getWhatsAppMessageLogsSummaryController };
