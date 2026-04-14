import { processWhatsAppWebhookUseCase } from "../../useCases/processWhatsAppWebhook";
import { WhatsAppWebhookController } from "./WhatsAppWebhookController";

const whatsAppWebhookController = new WhatsAppWebhookController(
  processWhatsAppWebhookUseCase,
);

export { whatsAppWebhookController };
