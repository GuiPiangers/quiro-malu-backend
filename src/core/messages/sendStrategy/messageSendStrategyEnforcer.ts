import { IMessageSendStrategyRepository } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { MessageSendStrategyFactory } from "./messageSendStrategyFactory";

export class MessageSendStrategyEnforcer {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
    private readonly messageSendStrategyFactory: MessageSendStrategyFactory,
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

    const strategy = this.messageSendStrategyFactory.create(row);

    return strategy.allowsSend({ userId, patientId });
  }
}
