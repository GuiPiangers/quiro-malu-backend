import {
  IMessageSendStrategyRepository,
  type MessageSendStrategyRow,
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

  private buildRecentFullReplacePatch(
    dto: UpdateMessageSendStrategyDTO,
    strategyId: string,
  ): UpdateMessageSendStrategyPatch {
    const params =
      dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS];
    const displayName = new MessageSendStrategyDisplayName(dto.name ?? "");
    const entity = new SendMostRecentPatientsMessageSendStrategy({
      id: strategyId,
      displayName,
      amount: params.amount,
    });
    return {
      kind: entity.kind,
      name: entity.displayName.value,
      params: { amount: entity.amount },
    };
  }

  private buildFrequencyFullReplacePatch(
    dto: UpdateMessageSendStrategyDTO,
    strategyId: string,
  ): UpdateMessageSendStrategyPatch {
    const params =
      dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS];
    const displayName = new MessageSendStrategyDisplayName(dto.name ?? "");
    const entity = new SendMostFrequencyPatientsMessageSendStrategy({
      id: strategyId,
      displayName,
      amount: params.amount,
    });
    return {
      kind: entity.kind,
      name: entity.displayName.value,
      params: { amount: entity.amount },
    };
  }

  private async buildSelectedListFullReplacePatch(
    dto: UpdateMessageSendStrategyDTO,
    strategyId: string,
  ): Promise<UpdateMessageSendStrategyPatch> {
    const params =
      dto.params as MessageSendStrategyCreateParamsByKind[typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST];
    const displayName = new MessageSendStrategyDisplayName(dto.name ?? "");
    const entity = new SendSelectedListMessageSendStrategy({
      id: strategyId,
      displayName,
      patientIdList: params.patientIdList,
    });
    await this.assertAllPatientsOwnedByUser(dto.userId, entity.patientIdList);
    return {
      kind: entity.kind,
      name: entity.displayName.value,
      params: { patientIdList: [...entity.patientIdList] },
    };
  }

  private async resolveFullReplacePatch(
    dto: UpdateMessageSendStrategyDTO,
    existing: MessageSendStrategyRow,
  ): Promise<UpdateMessageSendStrategyPatch> {
    const kind = dto.kind as SendStrategyKind;
    switch (kind) {
      case SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS:
        return this.buildRecentFullReplacePatch(dto, existing.id);
      case SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS:
        return this.buildFrequencyFullReplacePatch(dto, existing.id);
      case SEND_STRATEGY_KIND_SEND_SELECTED_LIST:
        return await this.buildSelectedListFullReplacePatch(dto, existing.id);
      default:
        throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
    }
  }

  private async resolveUpdatePatch(
    dto: UpdateMessageSendStrategyDTO,
    existing: MessageSendStrategyRow,
  ): Promise<UpdateMessageSendStrategyPatch | null> {
    const hasKind = dto.kind !== undefined;
    const hasParams = dto.params !== undefined;
    if (hasKind !== hasParams) {
      throw new ApiError(
        "kind e params devem ser informados juntos para alterar o tipo ou os parâmetros da estratégia",
        400,
        "kind",
      );
    }

    if (hasKind && hasParams) {
      return await this.resolveFullReplacePatch(dto, existing);
    }

    if (dto.name !== undefined) {
      const displayName = new MessageSendStrategyDisplayName(dto.name ?? "");
      return { name: displayName.value };
    }

    return null;
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

    const patch = await this.resolveUpdatePatch(dto, existing);
    if (patch === null) {
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
