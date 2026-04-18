import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

export type ListMessageSendStrategyDTO = {
  userId: string;
};

export type ListedMessageSendStrategyDTO = {
  id: string;
  userId: string;
  kind: string;
  params: Record<string, unknown>;
};

export class ListMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(
    dto: ListMessageSendStrategyDTO,
  ): Promise<ListedMessageSendStrategyDTO[]> {
    const rows = await this.messageSendStrategyRepository.listByUserId(
      dto.userId,
    );
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      kind: row.kind,
      params: row.params,
    }));
  }
}
