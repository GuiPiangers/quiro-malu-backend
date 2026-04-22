import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { IMessageSendStrategy, SendStrategyContext } from "../IMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS } from "../sendStrategyKind";

export class SendMostFrequencyPatientsStrategy implements IMessageSendStrategy {
  readonly kind = SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS;

  constructor(
    private readonly amount: number,
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async allowsSend(ctx: SendStrategyContext): Promise<boolean> {
    const ids =
      await this.schedulingRepository.listPatientIdsByUserIdOrderBySchedulingCountDesc(
        ctx.userId,
        this.amount,
      );
    const set = new Set(ids);
    return set.has(ctx.patientId);
  }
}
