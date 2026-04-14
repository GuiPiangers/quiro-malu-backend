/**
 * Extrai atualizações de status de mensagens do payload de webhook da Evolution API.
 * Formatos variam entre versões; este parser cobre o caso comum `data.key.id` + `data.update.status`.
 */
export type EvolutionMessageStatusUpdate = {
  providerMessageId: string;
  evolutionStatus: string;
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
    const id = key?.id;
    const update = o.update as Record<string, unknown> | undefined;
    const status = update?.status;
    if (typeof id === "string" && typeof status === "string") {
      updates.push({ providerMessageId: id, evolutionStatus: status });
    }
  }

  return { event, instanceName, updates };
}

export function isEvolutionMessagesUpdateEvent(event: string | undefined): boolean {
  if (!event) return false;
  const n = event.toLowerCase().replace(/_/g, "");
  return n.includes("messages") && n.includes("update");
}
