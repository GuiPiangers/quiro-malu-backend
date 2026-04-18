import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { IMessageSendStrategy, SendStrategyContext } from "../IMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../sendStrategyKind";

export class SendMostRecentPatientsStrategy implements IMessageSendStrategy {
  readonly kind = SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS;

  constructor(
    private readonly amount: number,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async allowsSend(ctx: SendStrategyContext): Promise<boolean> {
    const recent = await this.patientRepository.getMostRecent(
      ctx.userId,
      this.amount,
    );
    const ids = new Set(recent.map((p) => p.id).filter(Boolean) as string[]);
    return ids.has(ctx.patientId);
  }
}
