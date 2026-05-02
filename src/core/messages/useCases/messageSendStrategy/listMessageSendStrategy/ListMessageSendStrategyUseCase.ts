import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import {
  toMessageSendStrategyDTO,
  type MessageSendStrategyListItemDTO,
  type MessageSendStrategyPersistenceRow,
} from "../../../sendStrategy/messageSendStrategyKindTypeMaps";
import {
  SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
  UNIQUE_USER_STRATEGY_ID,
} from "../../../sendStrategy/sendStrategyKind";

export type ListMessageSendStrategyDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListedMessageSendStrategyDTO = MessageSendStrategyListItemDTO;

export type ListMessageSendStrategyOutput = {
  items: ListedMessageSendStrategyDTO[];
  total: number;
  page: number;
  limit: number;
};

function dbWindowForListPage(
  page: number,
  limit: number,
  totalDb: number,
): { includeVirtual: boolean; dbOffset: number; dbLimit: number } {
  const start = (page - 1) * limit;
  const combinedTotal = totalDb + 1;
  if (start >= combinedTotal) {
    return { includeVirtual: false, dbOffset: totalDb, dbLimit: 0 };
  }
  if (start === 0) {
    return {
      includeVirtual: true,
      dbOffset: 0,
      dbLimit: Math.max(0, Math.min(limit - 1, totalDb)),
    };
  }
  const dbOffset = start - 1;
  const dbLimit = Math.max(0, Math.min(limit, totalDb - dbOffset));
  return { includeVirtual: false, dbOffset, dbLimit };
}

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

    const virtualRow =
      (await this.messageSendStrategyRepository.findByIdAndUserId(
        UNIQUE_USER_STRATEGY_ID,
        dto.userId,
      )) ??
      ({
        id: UNIQUE_USER_STRATEGY_ID,
        userId: dto.userId,
        name: "Único por paciente",
        kind: SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
        params: {},
        campaignBindingsCount: 0,
      } satisfies MessageSendStrategyPersistenceRow);

    const virtualDto = toMessageSendStrategyDTO(virtualRow);

    const { total: totalDb } =
      await this.messageSendStrategyRepository.listByUserIdPaged({
        userId: dto.userId,
        limit: 0,
        offset: 0,
      });

    const { includeVirtual, dbOffset, dbLimit } = dbWindowForListPage(
      page,
      limit,
      totalDb,
    );

    const { items: rows } =
      await this.messageSendStrategyRepository.listByUserIdPaged({
        userId: dto.userId,
        limit: dbLimit,
        offset: dbOffset,
      });

    const rest = rows.map(toMessageSendStrategyDTO);
    const items: MessageSendStrategyListItemDTO[] = includeVirtual
      ? [virtualDto, ...rest]
      : rest;

    return {
      items,
      total: totalDb + 1,
      page,
      limit,
    };
  }
}
