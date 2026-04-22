import { ApiError } from "../../../utils/ApiError";
import { MessageSendStrategyDisplayName } from "../models/MessageSendStrategyDisplayName";
import type { UpdateMessageSendStrategyDTO } from "../useCases/messageSendStrategy/updateMessageSendStrategy/UpdateMessageSendStrategyUseCase";
import { parseHttpPatientIdList } from "./messageSendStrategyPatientListHttp";
import {
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  SEND_STRATEGY_KINDS,
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

function assertSendStrategyKind(value: unknown): SendStrategyKind {
  if (
    typeof value !== "string" ||
    !(SEND_STRATEGY_KINDS as readonly string[]).includes(value)
  ) {
    throw new ApiError("kind inválido", 400, "kind");
  }
  return value as SendStrategyKind;
}

function isAmountStrategyKind(kind: SendStrategyKind): boolean {
  return (
    kind === SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS ||
    kind === SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS
  );
}

function isSelectedListStrategyKind(kind: SendStrategyKind): boolean {
  return kind === SEND_STRATEGY_KIND_SEND_SELECTED_LIST;
}

export function buildValidatedUpdateMessageSendStrategyBody(
  body: Pick<UpdateMessageSendStrategyDTO, "name" | "kind" | "params">,
): Pick<UpdateMessageSendStrategyDTO, "name" | "kind" | "params"> {
  const hasKind = body.kind !== undefined;
  const hasParams = body.params !== undefined;
  if (hasKind !== hasParams) {
    throw new ApiError(
      "kind e params devem ser informados juntos para alterar o tipo ou os parâmetros da estratégia",
      400,
      "kind",
    );
  }

  if (hasKind && hasParams) {
    const kind = assertSendStrategyKind(body.kind);
    if (isSelectedListStrategyKind(kind)) {
      const paramsBody = body.params as { patientIdList?: unknown } | undefined;
      const patientIdList = parseHttpPatientIdList(paramsBody?.patientIdList);
      const nameRaw = typeof body.name === "string" ? body.name : "";
      const displayName = new MessageSendStrategyDisplayName(nameRaw);
      return {
        kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
        params: { patientIdList },
        name: displayName.value,
      };
    }
    if (!isAmountStrategyKind(kind)) {
      throw new ApiError("Tipo de estratégia ainda não suportado", 501, "kind");
    }
    const amountParams = body.params as { amount?: unknown } | undefined;
    const amount = parseHttpAmount(amountParams?.amount);
    const nameRaw = typeof body.name === "string" ? body.name : "";
    const displayName = new MessageSendStrategyDisplayName(nameRaw);
    return {
      kind,
      params: { amount },
      name: displayName.value,
    };
  }

  if (body.name !== undefined) {
    const displayName = new MessageSendStrategyDisplayName(
      typeof body.name === "string" ? body.name : "",
    );
    return { name: displayName.value };
  }

  return {};
}
