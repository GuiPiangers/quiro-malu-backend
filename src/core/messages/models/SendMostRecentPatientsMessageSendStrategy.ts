import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../sendStrategy/sendStrategyKind";
import type { MessageSendStrategyDTOForKind } from "../sendStrategy/messageSendStrategyKindTypeMaps";
import { MessageSendStrategyDisplayName } from "./MessageSendStrategyDisplayName";

export type SendMostRecentPatientsMessageSendStrategyDTO = {
  id?: string;
  displayName: MessageSendStrategyDisplayName;
  amount: number;
};

export class SendMostRecentPatientsMessageSendStrategy extends Entity {
  readonly displayName: MessageSendStrategyDisplayName;
  readonly amount: number;

  constructor(dto: SendMostRecentPatientsMessageSendStrategyDTO) {
    super(dto.id);
    this.displayName = dto.displayName;
    this.amount = SendMostRecentPatientsMessageSendStrategy.parseAmount(dto.amount);
  }

  private static assertAmountInRange(n: number, field: string): number {
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      throw new ApiError("amount deve ser inteiro entre 1 e 50", 400, field);
    }
    return n;
  }

  static parseAmount(raw: unknown): number {
    return SendMostRecentPatientsMessageSendStrategy.assertAmountInRange(
      Number(raw),
      "amount",
    );
  }

  static amountFromPersistedParams(params: Record<string, unknown>): number {
    const raw = params.amount;
    const n = typeof raw === "number" ? raw : Number(raw);
    return SendMostRecentPatientsMessageSendStrategy.assertAmountInRange(
      n,
      "params.amount",
    );
  }

  get kind(): typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS {
    return SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS;
  }

  getApiDTO(
    userId: string,
    campaignBindingsCount: number,
  ): MessageSendStrategyDTOForKind<typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS> {
    return {
      id: this.id,
      userId,
      name: this.displayName.value,
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      params: { amount: this.amount },
      campaignBindingsCount,
    };
  }
}
