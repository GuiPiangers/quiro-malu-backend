export const SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS =
  "send_most_recent_patients" as const;

export const SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS =
  "send_most_frequency_patients" as const;

export const SEND_STRATEGY_KIND_SEND_SELECTED_LIST =
  "send_selected_list" as const;

export const SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST =
  "exclude_patients_list" as const;

export const SEND_STRATEGY_KINDS = [
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
] as const;

export type SendStrategyKind = (typeof SEND_STRATEGY_KINDS)[number];
