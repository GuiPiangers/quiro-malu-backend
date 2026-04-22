import { ApiError } from "../../../utils/ApiError";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../repositories/scheduling/ISchedulingRepository";
import { MessageSendStrategyRow } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { SendMostRecentPatientsMessageSendStrategy } from "../models/SendMostRecentPatientsMessageSendStrategy";
import { IMessageSendStrategy } from "./IMessageSendStrategy";
import { SendMostFrequencyPatientsStrategy } from "./strategies/sendMostFrequencyPatientsStrategy";
import { SendMostRecentPatientsStrategy } from "./strategies/sendMostRecentPatientsStrategy";
import {
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
} from "./sendStrategyKind";
import { SendSelectedListStrategy } from "./strategies/sendSelectedListStrategy";

function persistedAmountOrThrow(
  kind: string,
  params: Record<string, unknown>,
): number {
  const raw = params.amount;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 50) {
    throw new ApiError(
      `params.amount inválido na estratégia persistida (${kind})`,
      500,
      "params.amount",
    );
  }
  return n;
}

export class MessageSendStrategyFactory {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly schedulingRepository: ISchedulingRepository,
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
      const amount = persistedAmountOrThrow(row.kind, row.params);
      return new SendMostFrequencyPatientsStrategy(
        amount,
        this.schedulingRepository,
      );
    }

    if (row.kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST) {
      const { patientIdList } = row.params as { patientIdList: string[] };
      return new SendSelectedListStrategy(patientIdList);
    }

    throw new ApiError(`Tipo de estratégia não suportado: ${row.kind}`, 501);
  }
}
