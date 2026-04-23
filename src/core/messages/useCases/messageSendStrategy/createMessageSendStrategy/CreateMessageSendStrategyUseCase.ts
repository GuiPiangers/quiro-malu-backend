import { Id } from "../../../../shared/Id";
import { ApiError } from "../../../../../utils/ApiError";
import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { MessageSendStrategyDisplayName } from "../../../models/MessageSendStrategyDisplayName";
import { SendMostFrequencyPatientsMessageSendStrategy } from "../../../models/SendMostFrequencyPatientsMessageSendStrategy";
import { SendMostRecentPatientsMessageSendStrategy } from "../../../models/SendMostRecentPatientsMessageSendStrategy";
import { ExcludePatientsListMessageSendStrategy } from "../../../models/ExcludePatientsListMessageSendStrategy";
import { SendSelectedListMessageSendStrategy } from "../../../models/SendSelectedListMessageSendStrategy";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
} from "../../../sendStrategy/sendStrategyKind";
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
    private readonly patientRepository: IPatientRepository,
  ) {}

  private async assertAllPatientsOwnedByUser(
    userId: string,
    patientIdList: readonly string[],
  ): Promise<void> {
    if (patientIdList.length === 0) {
      return;
    }
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

  async execute(dto: CreateMessageSendStrategyDTO): Promise<MessageSendStrategyDTO> {
    switch (dto.kind) {
      case SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS: {
        const { amount } = dto.params;
        const displayName = new MessageSendStrategyDisplayName(dto.name);
        const entity = new SendMostRecentPatientsMessageSendStrategy({
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
      case SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS: {
        const { amount } = dto.params;
        const displayName = new MessageSendStrategyDisplayName(dto.name);
        const entity = new SendMostFrequencyPatientsMessageSendStrategy({
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
      case SEND_STRATEGY_KIND_SEND_SELECTED_LIST: {
        const { patientIdList } = dto.params;
        const displayName = new MessageSendStrategyDisplayName(dto.name);
        const entity = new SendSelectedListMessageSendStrategy({
          displayName,
          patientIdList,
        });
        await this.assertAllPatientsOwnedByUser(dto.userId, entity.patientIdList);

        await this.messageSendStrategyRepository.save({
          id: entity.id,
          userId: dto.userId,
          name: entity.displayName.value,
          kind: entity.kind,
          params: { patientIdList: [...entity.patientIdList] },
        });

        return entity.getApiDTO(dto.userId, 0);
      }
      case SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST: {
        const { patientIdList } = dto.params;
        const displayName = new MessageSendStrategyDisplayName(dto.name);
        const entity = new ExcludePatientsListMessageSendStrategy({
          displayName,
          patientIdList,
        });
        await this.assertAllPatientsOwnedByUser(dto.userId, entity.patientIdList);

        await this.messageSendStrategyRepository.save({
          id: entity.id,
          userId: dto.userId,
          name: entity.displayName.value,
          kind: entity.kind,
          params: { patientIdList: [...entity.patientIdList] },
        });

        return entity.getApiDTO(dto.userId, 0);
      }
      default:
        throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
    }
  }
}
