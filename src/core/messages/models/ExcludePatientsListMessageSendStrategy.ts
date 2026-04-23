import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST } from "../sendStrategy/sendStrategyKind";
import type { MessageSendStrategyDTOForKind } from "../sendStrategy/messageSendStrategyKindTypeMaps";
import { MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS } from "./SendSelectedListMessageSendStrategy";
import { MessageSendStrategyDisplayName } from "./MessageSendStrategyDisplayName";

export type ExcludePatientsListMessageSendStrategyDTO = {
  id?: string;
  displayName: MessageSendStrategyDisplayName;
  patientIdList: readonly string[];
};

export class ExcludePatientsListMessageSendStrategy extends Entity {
  readonly displayName: MessageSendStrategyDisplayName;
  readonly patientIdList: readonly string[];

  constructor(dto: ExcludePatientsListMessageSendStrategyDTO) {
    super(dto.id);
    this.displayName = dto.displayName;
    const uniqueIds = [...new Set(dto.patientIdList)];
    ExcludePatientsListMessageSendStrategy.assertPatientIdListBounds(uniqueIds);
    this.patientIdList = uniqueIds;
  }

  private static assertPatientIdListBounds(list: readonly string[]): void {
    if (list.length > MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS) {
      throw new ApiError(
        `patientIdList deve ter no máximo ${MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS} ids`,
        400,
        "params.patientIdList",
      );
    }
  }

  get kind(): typeof SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST {
    return SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST;
  }

  getDTO() {
    return { id: this.id, name: this.displayName.value, kind: this.kind, params: { patientIdList: [...this.patientIdList] } };
  }
}
