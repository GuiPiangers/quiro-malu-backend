import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { SEND_STRATEGY_KIND_SEND_SELECTED_LIST } from "../sendStrategy/sendStrategyKind";
import type { MessageSendStrategyDTOForKind } from "../sendStrategy/messageSendStrategyKindTypeMaps";
import { MessageSendStrategyDisplayName } from "./MessageSendStrategyDisplayName";

export const MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS = 50;

export type SendSelectedListMessageSendStrategyDTO = {
  id?: string;
  displayName: MessageSendStrategyDisplayName;
  patientIdList: readonly string[];
};

export class SendSelectedListMessageSendStrategy extends Entity {
  readonly displayName: MessageSendStrategyDisplayName;
  readonly patientIdList: readonly string[];

  constructor(dto: SendSelectedListMessageSendStrategyDTO) {
    super(dto.id);
    this.displayName = dto.displayName;
    SendSelectedListMessageSendStrategy.assertPatientIdListBounds(dto.patientIdList);
    this.patientIdList = dto.patientIdList;
  }

  private static assertPatientIdListBounds(list: readonly string[]): void {
    if (list.length === 0) {
      throw new ApiError(
        "patientIdList deve conter ao menos um id",
        400,
        "params.patientIdList",
      );
    }
    if (list.length > MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS) {
      throw new ApiError(
        `patientIdList deve ter no máximo ${MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS} ids`,
        400,
        "params.patientIdList",
      );
    }
  }

  get kind(): typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST {
    return SEND_STRATEGY_KIND_SEND_SELECTED_LIST;
  }

  getApiDTO(
    userId: string,
    campaignBindingsCount: number,
  ): MessageSendStrategyDTOForKind<typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST> {
    return {
      id: this.id,
      userId,
      name: this.displayName.value,
      kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
      params: { patientIdList: [...this.patientIdList] },
      campaignBindingsCount,
    };
  }
}
