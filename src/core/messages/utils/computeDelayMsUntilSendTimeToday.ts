import { DateTime as Luxon } from "luxon";

const DEFAULT_ZONE = "America/Sao_Paulo";

function normalizeSendTimeToHms(sendTime: string): string {
  const t = sendTime.trim();
  const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return "09:00:00";
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  const s = m[3] != null ? Math.min(59, Math.max(0, Number(m[3]))) : 0;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Milissegundos até o próximo instante `sendTime` no **mesmo dia civil** em `America/Sao_Paulo`.
 * `sendTime`: "HH:mm" ou "HH:mm:ss". Se o horário já passou hoje, retorna 0 (envio imediato).
 */
export function computeDelayMsUntilSendTimeToday(
  sendTime: string,
  referenceNow?: Luxon,
): number {
  const now = (referenceNow ?? Luxon.now().setZone(DEFAULT_ZONE)).set({
    millisecond: 0,
  });
  const hms = normalizeSendTimeToHms(sendTime);
  const [hh, mm, ss] = hms.split(":").map((x) => Number(x));
  let target = now.set({
    hour: hh,
    minute: mm,
    second: ss,
    millisecond: 0,
  });
  if (target.toMillis() <= now.toMillis()) {
    return 0;
  }
  return target.toMillis() - now.toMillis();
}
