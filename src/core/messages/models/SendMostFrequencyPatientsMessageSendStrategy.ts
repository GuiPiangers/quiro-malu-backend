import { Entity } from "../../shared/Entity";
import { SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS } from "../sendStrategy/sendStrategyKind";
import type { MessageSendStrategyDTOForKind } from "../sendStrategy/messageSendStrategyKindTypeMaps";
import { MessageSendStrategyDisplayName } from "./MessageSendStrategyDisplayName";

export type SendMostFrequencyPatientsMessageSendStrategyDTO = {
  id?: string;
  displayName: MessageSendStrategyDisplayName;
  amount: number;
};

export class SendMostFrequencyPatientsMessageSendStrategy extends Entity {
  readonly displayName: MessageSendStrategyDisplayName;
  readonly amount: number;

  constructor(dto: SendMostFrequencyPatientsMessageSendStrategyDTO) {
    super(dto.id);
    this.displayName = dto.displayName;
    this.amount = dto.amount;
  }

  get kind(): typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS {
    return SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS;
  }

  getApiDTO(
    userId: string,
    campaignBindingsCount: number,
  ): MessageSendStrategyDTOForKind<typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS> {
    return {
      id: this.id,
      userId,
      name: this.displayName.value,
      kind: SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
      params: { amount: this.amount },
      campaignBindingsCount,
    };
  }
}
