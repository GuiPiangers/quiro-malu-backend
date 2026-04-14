import {
  IWhatsAppMessageLogRepository,
  WhatsAppMessageLogStatus,
} from "../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import {
  extractMessagesUpdatesFromEvolutionWebhook,
  isEvolutionMessagesUpdateEvent,
} from "../../utils/parseEvolutionMessagesUpdateWebhook";

function mapEvolutionStatusToLogStatus(
  evolutionStatus: string,
): WhatsAppMessageLogStatus | null {
  const s = evolutionStatus.toUpperCase();
  const map: Record<string, WhatsAppMessageLogStatus> = {
    SERVER_ACK: "SENT",
    DELIVERY_ACK: "DELIVERED",
    READ: "READ",
    ERROR: "FAILED",
    FAILED: "FAILED",
  };
  return map[s] ?? null;
}

export class ProcessWhatsAppWebhookUseCase {
  constructor(
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  async execute(body: Record<string, unknown>): Promise<void> {
    const { event, updates } = extractMessagesUpdatesFromEvolutionWebhook(body);

    if (!isEvolutionMessagesUpdateEvent(event)) {
      return;
    }

    for (const u of updates) {
      const status = mapEvolutionStatusToLogStatus(u.evolutionStatus);
      if (!status) continue;

      await this.whatsAppMessageLogRepository.updateByProviderMessageId({
        providerMessageId: u.providerMessageId,
        status,
        errorMessage:
          status === "FAILED" ? u.evolutionStatus : null,
      });
    }
  }
}
