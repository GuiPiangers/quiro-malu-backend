import { ApiError } from "../../../utils/ApiError";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { MessageSendStrategyRow } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IMessageSendStrategy } from "./IMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "./sendStrategyKind";
import { SendMostRecentPatientsStrategy } from "./strategies/sendMostRecentPatientsStrategy";

function parseAmount(params: Record<string, unknown>): number {
  const raw = params.amount;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 50) {
    throw new ApiError("amount deve ser inteiro entre 1 e 50", 400, "params.amount");
  }
  return n;
}

export class MessageSendStrategyFactory {
  create(
    row: MessageSendStrategyRow,
    patientRepository: IPatientRepository,
  ): IMessageSendStrategy {
    if (row.kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS) {
      const amount = parseAmount(row.params);
      return new SendMostRecentPatientsStrategy(amount, patientRepository);
    }

    throw new ApiError(`Tipo de estratégia não suportado: ${row.kind}`, 501);
  }
}
