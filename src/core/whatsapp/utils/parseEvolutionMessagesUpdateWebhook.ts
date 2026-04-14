export type EvolutionMessageStatusUpdate = {
  providerMessageId: string;
  evolutionStatus: string;
  /** Texto de erro quando a Evolution envia detalhe além do status */
  errorDetail?: string;
};

export function extractMessagesUpdatesFromEvolutionWebhook(body: Record<string, unknown>): {
  event: string | undefined;
  instanceName: string | undefined;
  updates: EvolutionMessageStatusUpdate[];
} {
  const event = typeof body.event === "string" ? body.event : undefined;
  const instanceRaw = body.instance;
  const instanceName =
    typeof instanceRaw === "string"
      ? instanceRaw
      : instanceRaw != null &&
          typeof instanceRaw === "object" &&
          typeof (instanceRaw as { instanceName?: unknown }).instanceName ===
            "string"
        ? String((instanceRaw as { instanceName: string }).instanceName)
        : undefined;

  const raw = body.data;
  const items = Array.isArray(raw) ? raw : raw != null ? [raw] : [];

  const updates: EvolutionMessageStatusUpdate[] = [];
  for (const item of items) {
    if (item == null || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;

    const key = o.key as Record<string, unknown> | undefined;
    const nestedId = key?.id;
    const update = o.update as Record<string, unknown> | undefined;
    const nestedStatus = update?.status;

    if (typeof nestedId === "string" && typeof nestedStatus === "string") {
      const msg = update?.message;
      const err = update?.error;
      let errorDetail: string | undefined;
      if (typeof msg === "string" && msg.trim()) errorDetail = msg;
      else if (typeof err === "string" && err.trim()) errorDetail = err;
      updates.push({
        providerMessageId: nestedId,
        evolutionStatus: nestedStatus,
        ...(errorDetail ? { errorDetail } : {}),
      });
      continue;
    }

    const keyId = o.keyId;
    const flatStatus = o.status;
    if (typeof keyId === "string" && typeof flatStatus === "string") {
      const msg = o.message;
      const err = o.error;
      let errorDetail: string | undefined;
      if (typeof msg === "string" && msg.trim()) errorDetail = msg;
      else if (typeof err === "string" && err.trim()) errorDetail = err;
      updates.push({
        providerMessageId: keyId,
        evolutionStatus: flatStatus,
        ...(errorDetail ? { errorDetail } : {}),
      });
    }
  }

  return { event, instanceName, updates };
}

export function isEvolutionMessagesUpdateEvent(event: string | undefined): boolean {
  if (!event) return false;
  const n = event.toLowerCase().replace(/_/g, "");
  return n.includes("messages") && n.includes("update");
}
