import { IMessageSendStrategy, SendStrategyContext } from "../IMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_SELECTED_LIST } from "../sendStrategyKind";

export class SendSelectedListStrategy implements IMessageSendStrategy {
  readonly kind = SEND_STRATEGY_KIND_SEND_SELECTED_LIST;

  private readonly allowedIds: Set<string>;

  constructor(patientIdList: string[]) {
    this.allowedIds = new Set(patientIdList);
  }

  async allowsSend(ctx: SendStrategyContext): Promise<boolean> {
    return this.allowedIds.has(ctx.patientId);
  }
}
