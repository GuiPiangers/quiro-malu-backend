import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../sendStrategy/sendStrategyKind";
import type { ListedMessageSendStrategyDTO } from "../listMessageSendStrategy/ListMessageSendStrategyUseCase";

const NAME_MAX_LENGTH = 255;

export type UpdateMessageSendStrategyDTO = {
  userId: string;
  strategyId: string;
  name?: string;
  amount?: number;
};

function toListedDTO(row: {
  id: string;
  userId: string;
  name: string;
  kind: string;
  params: Record<string, unknown>;
  campaignBindingsCount: number;
}): ListedMessageSendStrategyDTO {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    kind: row.kind,
    params: row.params,
    campaignBindingsCount: row.campaignBindingsCount,
  };
}

export class UpdateMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(
    dto: UpdateMessageSendStrategyDTO,
  ): Promise<ListedMessageSendStrategyDTO> {
    const existing = await this.messageSendStrategyRepository.findByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );

    if (!existing) {
      throw new ApiError("Estratégia de envio não encontrada", 404);
    }

    const hasName = dto.name !== undefined;
    const hasAmount = dto.amount !== undefined;

    if (!hasName && !hasAmount) {
      return toListedDTO(existing);
    }

    if (hasName) {
      const name = typeof dto.name === "string" ? dto.name.trim() : "";
      if (!name) {
        throw new ApiError("name não pode ser vazio", 400, "name");
      }
      if (name.length > NAME_MAX_LENGTH) {
        throw new ApiError(
          `name deve ter no máximo ${NAME_MAX_LENGTH} caracteres`,
          400,
          "name",
        );
      }
    }

    if (hasAmount) {
      if (existing.kind !== SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS) {
        throw new ApiError(
          "amount só pode ser alterado neste tipo de estratégia",
          400,
          "amount",
        );
      }
      const amount = Number(dto.amount);
      if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
        throw new ApiError("amount deve ser inteiro entre 1 e 50", 400, "amount");
      }
    }

    const patch: {
      name?: string;
      params?: Record<string, unknown>;
    } = {};

    if (hasName) {
      patch.name = (dto.name as string).trim();
    }
    if (hasAmount) {
      patch.params = {
        ...existing.params,
        amount: Number(dto.amount),
      };
    }

    await this.messageSendStrategyRepository.updateByIdAndUserId(
      dto.strategyId,
      dto.userId,
      patch,
    );

    const updated = await this.messageSendStrategyRepository.findByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );

    return toListedDTO(updated!);
  }
}
