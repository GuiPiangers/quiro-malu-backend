import type { SendStrategyKind } from "./sendStrategyKind";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
} from "./sendStrategyKind";

type MessageSendStrategyAmountParamKinds =
  | typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS
  | typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS;

type MessageSendStrategyPatientListParamKinds =
  | typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST
  | typeof SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST;

export type MessageSendStrategyParamsByKind = {
  [K in SendStrategyKind]: K extends MessageSendStrategyAmountParamKinds
    ? { amount: number }
    : K extends MessageSendStrategyPatientListParamKinds
      ? { patientIdList: string[] }
      : Record<string, unknown>;
};

export type MessageSendStrategyCreateParamsByKind = MessageSendStrategyParamsByKind

export type CreateMessageSendStrategyDTO = {
  [K in SendStrategyKind]: {
    userId: string;
    kind: K;
    name: string;
    params: MessageSendStrategyCreateParamsByKind[K];
  };
}[SendStrategyKind];

export type CreateMessageSendStrategyHttpBody = {
  kind?: SendStrategyKind;
  name?: string;
  params?: MessageSendStrategyCreateParamsByKind[SendStrategyKind];
};

export type MessageSendStrategyDTOForKind<K extends SendStrategyKind> = {
  id: string;
  userId: string;
  name: string;
  kind: K;
  params: MessageSendStrategyParamsByKind[K];
  campaignBindingsCount: number;
};

export type MessageSendStrategyDTO = {
  [K in SendStrategyKind]: MessageSendStrategyDTOForKind<K>;
}[SendStrategyKind];

export type MessageSendStrategyPersistenceRow = {
  id: string;
  userId: string;
  name: string;
  kind: string;
  params: Record<string, unknown>;
  campaignBindingsCount: number;
};

export function toMessageSendStrategyDTO(
  row: MessageSendStrategyPersistenceRow,
): MessageSendStrategyDTO {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    kind: row.kind as SendStrategyKind,
    params: row.params,
    campaignBindingsCount: row.campaignBindingsCount,
  } as MessageSendStrategyDTO;
}
