import { ApiError } from "../../../utils/ApiError";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../repositories/scheduling/ISchedulingRepository";
import { IWhatsAppMessageLogRepository } from "../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { MessageSendStrategyRow } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { SendMostRecentPatientsMessageSendStrategy } from "../models/SendMostRecentPatientsMessageSendStrategy";
import { IMessageSendStrategy } from "./IMessageSendStrategy";
import { SendMostFrequencyPatientsStrategy } from "./strategies/sendMostFrequencyPatientsStrategy";
import { SendMostRecentPatientsStrategy } from "./strategies/sendMostRecentPatientsStrategy";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
} from "./sendStrategyKind";
import { ExcludePatientsListStrategy } from "./strategies/excludePatientsListStrategy";
import { SendSelectedListStrategy } from "./strategies/sendSelectedListStrategy";
import { UniqueSendByPatientStrategy } from "./strategies/uniqueSendByPatientStrategy";

export class MessageSendStrategyFactory {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly schedulingRepository: ISchedulingRepository,
    private readonly whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  create(row: MessageSendStrategyRow): IMessageSendStrategy {
    if (row.kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS) {
      const amount =
        SendMostRecentPatientsMessageSendStrategy.amountFromPersistedParams(
          row.params,
        );
      return new SendMostRecentPatientsStrategy(
        amount,
        this.patientRepository,
      );
    }

    if (row.kind === SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS) {
      const amount = row.params.amount as number;
      return new SendMostFrequencyPatientsStrategy(
        amount,
        this.schedulingRepository,
      );
    }

    if (row.kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST) {
      const { patientIdList } = row.params as { patientIdList: string[] };
      return new SendSelectedListStrategy(patientIdList);
    }

    if (row.kind === SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST) {
      const { patientIdList } = row.params as { patientIdList: string[] };
      return new ExcludePatientsListStrategy(patientIdList);
    }

    if (row.kind === SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT) {
      return new UniqueSendByPatientStrategy(this.whatsAppMessageLogRepository);
    }

    throw new ApiError(`Tipo de estratégia não suportado: ${row.kind}`, 501);
  }
}
