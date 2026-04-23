import { ApiError } from "../../../utils/ApiError";
import { MessageSendStrategyDisplayName } from "../models/MessageSendStrategyDisplayName";
import type {
  CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyHttpBody,
} from "../sendStrategy/messageSendStrategyKindTypeMaps";
import { parseHttpPatientIdList } from "./messageSendStrategyPatientListHttp";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  type SendStrategyKind,
} from "../sendStrategy/sendStrategyKind";

const AMOUNT_MIN = 1;
const AMOUNT_MAX = 50;

function assertAmountInRange(n: number): number {
  if (!Number.isInteger(n) || n < AMOUNT_MIN || n > AMOUNT_MAX) {
    throw new ApiError(
      `amount deve ser inteiro entre ${AMOUNT_MIN} e ${AMOUNT_MAX}`,
      400,
      "params.amount",
    );
  }
  return n;
}

function parseHttpAmount(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  return assertAmountInRange(n);
}

function isAmountStrategyKind(kind: SendStrategyKind): boolean {
  return (
    kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS ||
    kind === SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS
  );
}

function isPatientListStrategyKind(kind: SendStrategyKind): boolean {
  return (
    kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST ||
    kind === SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST
  );
}

export function buildValidatedCreateMessageSendStrategyDTO(
  userId: string,
  body: CreateMessageSendStrategyHttpBody,
): CreateMessageSendStrategyDTO {
  const kind = body.kind ?? SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS;
  const nameRaw = typeof body.name === "string" ? body.name : "";

  if (isPatientListStrategyKind(kind)) {
    const displayName = new MessageSendStrategyDisplayName(nameRaw);
    const paramsBody = body.params as { patientIdList?: unknown } | undefined;
    if (kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST) {
      const patientIdList = parseHttpPatientIdList(paramsBody?.patientIdList);
      return {
        userId,
        kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
        name: displayName.value,
        params: { patientIdList },
      };
    }
    const patientIdList = parseHttpPatientIdList(paramsBody?.patientIdList, {
      allowEmpty: true,
    });
    return {
      userId,
      kind: SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
      name: displayName.value,
      params: { patientIdList },
    };
  }

  const displayName = new MessageSendStrategyDisplayName(nameRaw);

  if (!isAmountStrategyKind(kind)) {
    throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
  }

  const amountParams = body.params as { amount?: unknown } | undefined;
  const amount = parseHttpAmount(amountParams?.amount);
  const params = { amount };

  if (kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS) {
    return {
      userId,
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: displayName.value,
      params,
    };
  }

  return {
    userId,
    kind: SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
    name: displayName.value,
    params,
  };
}
