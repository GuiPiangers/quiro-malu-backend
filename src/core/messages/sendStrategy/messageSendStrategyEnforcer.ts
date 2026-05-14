import { IMessageSendStrategyRepository } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { MessageSendStrategyFactory } from "./messageSendStrategyFactory";

export type IsSendAllowedParams = {
  userId: string;
  clinicId: string;
  campaignId: string;
  patientId: string;
};

export class MessageSendStrategyEnforcer {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
    private readonly messageSendStrategyFactory: MessageSendStrategyFactory,
  ) {}

  async isSendAllowed(params: IsSendAllowedParams): Promise<boolean> {
    const { userId, clinicId, campaignId, patientId } = params;
    const rows =
      await this.messageSendStrategyRepository.findActiveStrategiesByUserAndCampaign(
        userId,
        campaignId,
      );

    if (rows.length === 0) {
      return true;
    }

    for (const row of rows) {
      const strategy = this.messageSendStrategyFactory.create(row);
      if (
        !(await strategy.allowsSend({
          userId,
          clinicId,
          patientId,
          campaignId,
        }))
      ) {
        return false;
      }
    }

    return true;
  }
}
