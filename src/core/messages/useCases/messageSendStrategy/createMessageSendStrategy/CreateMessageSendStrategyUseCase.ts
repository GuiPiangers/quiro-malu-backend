import { Id } from "../../../../shared/Id";
import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { MessageSendStrategyDisplayName } from "../../../models/MessageSendStrategyDisplayName";
import { SendMostRecentPatientsMessageSendStrategy } from "../../../models/SendMostRecentPatientsMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../sendStrategy/sendStrategyKind";
import type {
  CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyHttpBody,
  MessageSendStrategyDTO,
} from "../../../sendStrategy/messageSendStrategyKindTypeMaps";

export type {
  CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyHttpBody,
  MessageSendStrategyDTO,
};

export class CreateMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(dto: CreateMessageSendStrategyDTO): Promise<MessageSendStrategyDTO> {
    switch (dto.kind) {
      case SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS: {
        const id = new Id().value;
        const { amount } = dto.params;
        const displayName = new MessageSendStrategyDisplayName(dto.name);
        const entity = new SendMostRecentPatientsMessageSendStrategy({
          id,
          displayName,
          amount,
        });

        await this.messageSendStrategyRepository.save({
          id: entity.id,
          userId: dto.userId,
          name: entity.displayName.value,
          kind: entity.kind,
          params: { amount: entity.amount },
        });

        return entity.getApiDTO(dto.userId, 0);
      }
      default:
        throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
    }
  }
}
