import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../../utils/ApiError";
import type { PatientDTO } from "../../../../patients/models/Patient";
import {
  toMessageSendStrategyDTO,
  type MessageSendStrategyDTO,
} from "../../../sendStrategy/messageSendStrategyKindTypeMaps";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
} from "../../../sendStrategy/sendStrategyKind";

export type GetMessageSendStrategyDTO = {
  userId: string;
  strategyId: string;
};

export type GetMessageSendStrategyPatientView = {
  name: string;
  phone: string;
  cpf?: string;
};

export type GetMessageSendStrategyOutput = MessageSendStrategyDTO & {
  patients: GetMessageSendStrategyPatientView[];
};

function patientToView(patient: PatientDTO): GetMessageSendStrategyPatientView {
  return {
    name: patient.name,
    phone: patient.phone,
    cpf: patient.cpf,
  };
}

export class GetMessageSendStrategyUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(dto: GetMessageSendStrategyDTO): Promise<GetMessageSendStrategyOutput> {
    const row = await this.messageSendStrategyRepository.findByIdAndUserId(
      dto.strategyId,
      dto.userId,
    );

    if (!row) {
      throw new ApiError("Estratégia de envio não encontrada", 404);
    }

    const strategy = toMessageSendStrategyDTO(row);
    const patients = await this.resolvePatientsForStrategy(dto.userId, strategy);

    return { ...strategy, patients };
  }

  private async resolvePatientsForStrategy(
    userId: string,
    strategy: MessageSendStrategyDTO,
  ): Promise<GetMessageSendStrategyPatientView[]> {
    switch (strategy.kind) {
      case SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS: {
        const list = await this.patientRepository.getMostRecent(
          userId,
          strategy.params.amount,
        );
        return list.map(patientToView);
      }
      case SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS: {
        const list = await this.patientRepository.getMostFrequent(
          userId,
          strategy.params.amount,
        );
        return list.map(patientToView);
      }
      case SEND_STRATEGY_KIND_SEND_SELECTED_LIST:
      case SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST: {
        const list = await this.patientRepository.listPatientsById({
          userId,
          patientIds: strategy.params.patientIdList,
        });
        return list.map(patientToView);
      }
      default:
        return [];
    }
  }
}
