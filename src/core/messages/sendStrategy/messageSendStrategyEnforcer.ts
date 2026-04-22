import { IMessageSendStrategyRepository } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../repositories/scheduling/ISchedulingRepository";
import { MessageSendStrategyFactory } from "./messageSendStrategyFactory";

export class MessageSendStrategyEnforcer {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
    private readonly messageSendStrategyFactory: MessageSendStrategyFactory,
    private readonly patientRepository: IPatientRepository,
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async isSendAllowed(
    userId: string,
    campaignId: string,
    patientId: string,
  ): Promise<boolean> {
    const row =
      await this.messageSendStrategyRepository.findActiveStrategyByUserAndCampaign(
        userId,
        campaignId,
      );

    if (!row) {
      return true;
    }

    const strategy = this.messageSendStrategyFactory.create(row, {
      patientRepository: this.patientRepository,
      schedulingRepository: this.schedulingRepository,
    });

    return strategy.allowsSend({ userId, patientId });
  }
}
