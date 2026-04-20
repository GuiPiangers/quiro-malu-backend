import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";

export type ListMessageSendStrategyDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListedMessageSendStrategyDTO = {
  id: string;
  userId: string;
  name: string;
  kind: string;
  params: Record<string, unknown>;
  campaignBindingsCount: number;
};

export type ListMessageSendStrategyOutput = {
  items: ListedMessageSendStrategyDTO[];
  total: number;
  page: number;
  limit: number;
};

export class ListMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(
    dto: ListMessageSendStrategyDTO,
  ): Promise<ListMessageSendStrategyOutput> {
    const page = Math.max(1, Number(dto.page) || 1);
    const rawLimit = Number(dto.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const offset = (page - 1) * limit;

    const { items: rows, total } =
      await this.messageSendStrategyRepository.listByUserIdPaged({
        userId: dto.userId,
        limit,
        offset,
      });

    const items = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      kind: row.kind,
      params: row.params,
      campaignBindingsCount: row.campaignBindingsCount,
    }));

    return { items, total, page, limit };
  }
}
