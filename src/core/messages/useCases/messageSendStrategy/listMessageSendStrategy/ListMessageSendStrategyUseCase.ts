import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import {
  toMessageSendStrategyDTO,
  type MessageSendStrategyDTO,
} from "../../../sendStrategy/messageSendStrategyKindTypeMaps";

export type ListMessageSendStrategyDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListedMessageSendStrategyDTO = MessageSendStrategyDTO;

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

    const items = rows.map(toMessageSendStrategyDTO);

    return { items, total, page, limit };
  }
}
