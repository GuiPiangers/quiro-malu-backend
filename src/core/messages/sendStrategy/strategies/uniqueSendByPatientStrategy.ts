import { IWhatsAppMessageLogRepository } from "../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { IMessageSendStrategy, SendStrategyContext } from "../IMessageSendStrategy";
import { SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT } from "../sendStrategyKind";

export class UniqueSendByPatientStrategy implements IMessageSendStrategy {
  readonly kind = SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT;

  constructor(
    private readonly whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  async allowsSend(ctx: SendStrategyContext): Promise<boolean> {
    if (!ctx.campaignId) {
      return false;
    }

    const { total } = await this.whatsAppMessageLogRepository.listByUserId({
      userId: ctx.userId,
      patientId: ctx.patientId,
      scheduleMessageConfigId: ctx.campaignId,
      limit: 1,
      offset: 0,
    });

    return total === 0;
  }
}
