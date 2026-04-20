import { ApiError } from "../../../utils/ApiError";
import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { MessageSendStrategyRow } from "../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { IMessageSendStrategy } from "./IMessageSendStrategy";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "./sendStrategyKind";
import { SendMostRecentPatientsMessageSendStrategy } from "../models/SendMostRecentPatientsMessageSendStrategy";
import { SendMostRecentPatientsStrategy } from "./strategies/sendMostRecentPatientsStrategy";

export class MessageSendStrategyFactory {
  create(
    row: MessageSendStrategyRow,
    patientRepository: IPatientRepository,
  ): IMessageSendStrategy {
    if (row.kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS) {
      const amount =
        SendMostRecentPatientsMessageSendStrategy.amountFromPersistedParams(
          row.params,
        );
      return new SendMostRecentPatientsStrategy(amount, patientRepository);
    }

    throw new ApiError(`Tipo de estratégia não suportado: ${row.kind}`, 501);
  }
}
