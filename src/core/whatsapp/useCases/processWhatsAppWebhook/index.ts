import { KnexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/KnexWhatsAppMessageLogRepository";
import { ProcessWhatsAppWebhookUseCase } from "./ProcessWhatsAppWebhookUseCase";

const whatsAppMessageLogRepository = new KnexWhatsAppMessageLogRepository();

const processWhatsAppWebhookUseCase = new ProcessWhatsAppWebhookUseCase(
  whatsAppMessageLogRepository,
);

export { processWhatsAppWebhookUseCase };
