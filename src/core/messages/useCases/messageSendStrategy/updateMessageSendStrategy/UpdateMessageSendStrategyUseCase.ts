import {
  IMessageSendStrategyRepository,
  type UpdateMessageSendStrategyPatch,
} from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { MessageSendStrategyDisplayName } from "../../../models/MessageSendStrategyDisplayName";
import { SendMostFrequencyPatientsMessageSendStrategy } from "../../../models/SendMostFrequencyPatientsMessageSendStrategy";
import { SendMostRecentPatientsMessageSendStrategy } from "../../../models/SendMostRecentPatientsMessageSendStrategy";
import { SendSelectedListMessageSendStrategy } from "../../../models/SendSelectedListMessageSendStrategy";
import type { MessageSendStrategyCreateParamsByKind } from "../../../sendStrategy/messageSendStrategyKindTypeMaps";
import {
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  type SendStrategyKind,
} from "../../../sendStrategy/sendStrategyKind";
import type { ListedMessageSendStrategyDTO } from "../listMessageSendStrategy/ListMessageSendStrategyUseCase";

export type UpdateMessageSendStrategyDTO = {
  userId: string;
  strategyId: string;
  name?: string;
  kind?: SendStrategyKind;
  params?: MessageSendStrategyCreateParamsByKind[SendStrategyKind];
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
    private readonly patientRepository: IPatientRepository,
  ) {}

  private async assertAllPatientsOwnedByUser(
    userId: string,
    patientIdList: readonly string[],
  ): Promise<void> {
    const owned = await this.patientRepository.countPatientsOwnedByUser({
      userId,
      patientIds: [...patientIdList],
    });
    if (owned !== patientIdList.length) {
      throw new ApiError(
        "Um ou mais pacientes não existem ou não pertencem ao usuário",
        400,
        "params.patientIdList",
      );
    }
  }

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

    const hasKind = dto.kind !== undefined;
    const hasParams = dto.params !== undefined;
    if (hasKind !== hasParams) {
      throw new ApiError(
        "kind e params devem ser informados juntos para alterar o tipo ou os parâmetros da estratégia",
        400,
        "kind",
      );
    }

    const patch: UpdateMessageSendStrategyPatch = {};

    if (hasKind && hasParams) {
      const kind = dto.kind as SendStrategyKind;
      switch (kind) {
        case SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS: {
          const params =
            dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS];
          const displayName = new MessageSendStrategyDisplayName(
            dto.name ?? "",
          );
          const entity = new SendMostRecentPatientsMessageSendStrategy({
            id: existing.id,
            displayName,
            amount: params.amount,
          });
          patch.kind = entity.kind;
          patch.name = entity.displayName.value;
          patch.params = { amount: entity.amount };
          break;
        }
        case SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS: {
          const params =
            dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS];
          const displayName = new MessageSendStrategyDisplayName(
            dto.name ?? "",
          );
          const entity = new SendMostFrequencyPatientsMessageSendStrategy({
            id: existing.id,
            displayName,
            amount: params.amount,
          });
          patch.kind = entity.kind;
          patch.name = entity.displayName.value;
          patch.params = { amount: entity.amount };
          break;
        }
        case SEND_STRATEGY_KIND_SEND_SELECTED_LIST: {
          const params =
            dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST];
          const displayName = new MessageSendStrategyDisplayName(
            dto.name ?? "",
          );
          const entity = new SendSelectedListMessageSendStrategy({
            id: existing.id,
            displayName,
            patientIdList: params.patientIdList,
          });
          await this.assertAllPatientsOwnedByUser(dto.userId, entity.patientIdList);
          patch.kind = entity.kind;
          patch.name = entity.displayName.value;
          patch.params = { patientIdList: entity.patientIdList };
          break;
        }
        default:
          throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
      }
    }

    if (dto.name !== undefined && !hasKind) {
      const displayName = new MessageSendStrategyDisplayName(
        dto.name ?? "",
      );
      patch.name = displayName.value;
    }

    if (Object.keys(patch).length === 0) {
      return toListedDTO(existing);
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
