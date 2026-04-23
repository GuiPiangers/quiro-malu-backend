import { IMessageSendStrategy, SendStrategyContext } from "../IMessageSendStrategy";
import { SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST } from "../sendStrategyKind";

export class ExcludePatientsListStrategy implements IMessageSendStrategy {
  readonly kind = SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST;

  private readonly excludedIds: Set<string>;

  constructor(patientIdList: string[]) {
    this.excludedIds = new Set(patientIdList);
  }

  async allowsSend(ctx: SendStrategyContext): Promise<boolean> {
    return !this.excludedIds.has(ctx.patientId);
  }
}
