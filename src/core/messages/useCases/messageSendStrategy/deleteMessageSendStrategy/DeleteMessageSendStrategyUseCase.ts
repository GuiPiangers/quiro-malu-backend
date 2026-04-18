import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

export type DeleteMessageSendStrategyDTO = {
  userId: string;
  strategyId: string;
};

export class DeleteMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: DeleteMessageSendStrategyDTO): Promise<void> {
    await this.messageSendStrategyRepository.deleteByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );
  }
}
