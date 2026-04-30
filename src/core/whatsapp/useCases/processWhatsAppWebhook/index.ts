import { ProcessWhatsAppWebhookUseCase } from "./ProcessWhatsAppWebhookUseCase";
import { knexWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/knexInstances";

const whatsAppMessageLogRepository = knexWhatsAppMessageLogRepository;

const processWhatsAppWebhookUseCase = new ProcessWhatsAppWebhookUseCase(
  whatsAppMessageLogRepository,
);

export { processWhatsAppWebhookUseCase };