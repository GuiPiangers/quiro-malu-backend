import type { Knex } from "knex";
import {
  SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
  UNIQUE_USER_STRATEGY_ID,
} from "../../core/messages/sendStrategy/sendStrategyKind";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IMessageSendStrategyRepository,
  ListMessageSendStrategiesByUserIdProps,
  ListMessageSendStrategiesByUserIdResult,
  MessageSendStrategyRow,
  SaveMessageSendStrategyProps,
  UpdateMessageSendStrategyPatch,
} from "./IMessageSendStrategyRepository";

function parseParams(raw: unknown): Record<string, unknown> {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw as Record<string, unknown>;
  }
  return {};
}

function parseCampaignBindingsCount(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
}

function rowBindingsCount(row: Record<string, unknown>): number {
  const raw =
    row.campaignBindingsCount ?? row.campaignbindingscount;
  return parseCampaignBindingsCount(raw);
}

function buildVirtualUniqueUserStrategyRow(userId: string): MessageSendStrategyRow {
  return {
    id: UNIQUE_USER_STRATEGY_ID,
    userId,
    name: "Único por paciente",
    kind: SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
    params: {},
    campaignBindingsCount: 0,
  };
}

function bindingsCountSubquery(knex: Knex, strategyTableRef: string) {
  return knex.raw(
    `(SELECT COUNT(*) FROM \`${ETableNames.USER_MESSAGE_SEND_STRATEGY}\` u WHERE u.strategyId = ${strategyTableRef}) AS campaignBindingsCount`,
  );
}

async function countUniqueSendCampaignBindings(
  knex: Knex,
  userId: string,
): Promise<number> {
  const rows = await knex(ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY)
    .where({ userId })
    .select(knex.raw("COUNT(DISTINCT campaignId) AS c"));
  const raw = (rows[0] as { c: string | number } | undefined)?.c;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export class KnexMessageSendStrategyRepository
  implements IMessageSendStrategyRepository
{
  constructor(private readonly knex: Knex) {}

  async listByUserIdPaged(
    data: ListMessageSendStrategiesByUserIdProps,
  ): Promise<ListMessageSendStrategiesByUserIdResult> {
    try {
      const base = () =>
        this.knex(ETableNames.MESSAGE_SEND_STRATEGIES).where({ userId: data.userId });

      const countRows = await base().clone().count<{ total: string | number }>(
        "* as total",
      );
      const total = Number(
        (Array.isArray(countRows) ? countRows[0] : countRows)?.total ?? 0,
      );

      const strategyTable = `\`${ETableNames.MESSAGE_SEND_STRATEGIES}\`.id`;
      const rows = await base()
        .clone()
        .select(
          "id",
          "userId",
          "name",
          "kind",
          "params",
          bindingsCountSubquery(this.knex, strategyTable),
        )
        .orderBy("created_at", "desc")
        .limit(data.limit)
        .offset(data.offset);

      const items: MessageSendStrategyRow[] = rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        name: row.name ?? "",
        kind: row.kind,
        params: parseParams(row.params),
        campaignBindingsCount: rowBindingsCount(row as Record<string, unknown>),
      }));

      return { items, total };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async save(data: SaveMessageSendStrategyProps): Promise<void> {
    try {
      await this.knex(ETableNames.MESSAGE_SEND_STRATEGIES).insert({
        id: data.id,
        userId: data.userId,
        name: data.name,
        kind: data.kind,
        params: data.params,
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<MessageSendStrategyRow | null> {
    try {
      if (id === UNIQUE_USER_STRATEGY_ID) {
        const campaignBindingsCount = await countUniqueSendCampaignBindings(
          this.knex,
          userId,
        );
        return {
          ...buildVirtualUniqueUserStrategyRow(userId),
          campaignBindingsCount,
        };
      }

      const strategyTable = `\`${ETableNames.MESSAGE_SEND_STRATEGIES}\`.id`;
      const row = await this.knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .select(
          "id",
          "userId",
          "name",
          "kind",
          "params",
          bindingsCountSubquery(this.knex, strategyTable),
        )
        .where({ id, userId })
        .first();

      if (!row) return null;

      return {
        id: row.id,
        userId: row.userId,
        name: row.name ?? "",
        kind: row.kind,
        params: parseParams(row.params),
        campaignBindingsCount: rowBindingsCount(row as Record<string, unknown>),
      };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async findActiveStrategiesByUserAndCampaign(
    userId: string,
    campaignId: string,
  ): Promise<MessageSendStrategyRow[]> {
    try {
      const standards = await this.knex(ETableNames.USER_MESSAGE_SEND_STRATEGY)
        .where({ userId, campaignId })
        .select("strategyId", "created_at")
        .orderBy("created_at", "asc");

      const uniqueBinding = await this.knex(
        ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY,
      )
        .where({ userId, campaignId })
        .select("created_at")
        .first();

      type MergeItem =
        | { kind: "standard"; strategyId: string; sortAt: number }
        | { kind: "unique"; sortAt: number };

      const mergeItems: MergeItem[] = [
        ...standards.map((row) => ({
          kind: "standard" as const,
          strategyId: row.strategyId as string,
          sortAt: new Date(row.created_at as string | Date).getTime(),
        })),
        ...(uniqueBinding
          ? [
              {
                kind: "unique" as const,
                sortAt: new Date(
                  uniqueBinding.created_at as string | Date,
                ).getTime(),
              },
            ]
          : []),
      ];
      mergeItems.sort((a, b) => a.sortAt - b.sortAt);

      const out: MessageSendStrategyRow[] = [];

      for (const item of mergeItems) {
        if (item.kind === "unique") {
          out.push(buildVirtualUniqueUserStrategyRow(userId));
          continue;
        }

        const { strategyId } = item;
        const strategyTable = `\`${ETableNames.MESSAGE_SEND_STRATEGIES}\`.id`;
        const row = await this.knex(ETableNames.MESSAGE_SEND_STRATEGIES)
          .select(
            "id",
            "userId",
            "name",
            "kind",
            "params",
            bindingsCountSubquery(this.knex, strategyTable),
          )
          .where({ id: strategyId, userId })
          .first();

        if (!row) {
          continue;
        }

        out.push({
          id: row.id,
          userId: row.userId,
          name: row.name ?? "",
          kind: row.kind,
          params: parseParams(row.params),
          campaignBindingsCount: rowBindingsCount(row as Record<string, unknown>),
        });
      }

      return out;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async setCampaignStrategyBindings(
    userId: string,
    campaignId: string,
    strategyIds: string[],
  ): Promise<void> {
    try {
      await this.knex.transaction(async (trx) => {
        await trx(ETableNames.USER_MESSAGE_SEND_STRATEGY)
          .where({ userId, campaignId })
          .del();
        await trx(ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY)
          .where({ userId, campaignId })
          .del();

        const realIds = strategyIds.filter((id) => id !== UNIQUE_USER_STRATEGY_ID);
        const includeUnique = strategyIds.includes(UNIQUE_USER_STRATEGY_ID);

        if (realIds.length > 0) {
          await trx(ETableNames.USER_MESSAGE_SEND_STRATEGY).insert(
            realIds.map((strategyId) => ({
              userId,
              campaignId,
              strategyId,
            })),
          );
        }
        if (includeUnique) {
          await trx(ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY).insert({
            userId,
            campaignId,
          });
        }
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async deleteCampaignBinding(
    userId: string,
    campaignId: string,
  ): Promise<void> {
    try {
      await this.knex(ETableNames.USER_CAMPAIGN_UNIQUE_SEND_STRATEGY)
        .where({ userId, campaignId })
        .del();
      await this.knex(ETableNames.USER_MESSAGE_SEND_STRATEGY)
        .where({ userId, campaignId })
        .del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async updateByIdAndUserId(
    id: string,
    userId: string,
    patch: UpdateMessageSendStrategyPatch,
  ): Promise<void> {
    try {
      if (id === UNIQUE_USER_STRATEGY_ID) {
        throw new ApiError("Estratégia não pode ser alterada", 400);
      }

      const row: Record<string, unknown> = {};
      if (patch.name !== undefined) {
        row.name = patch.name;
      }
      if (patch.kind !== undefined) {
        row.kind = patch.kind;
      }
      if (patch.params !== undefined) {
        row.params = JSON.stringify(patch.params);
      }

      if (Object.keys(row).length === 0) {
        return;
      }

      const updated = await this.knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .where({ id, userId })
        .update(row);

      if (updated === 0) {
        throw new ApiError("Estratégia não encontrada", 404);
      }
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<void> {
    try {
      if (id === UNIQUE_USER_STRATEGY_ID) {
        throw new ApiError("Estratégia não pode ser removida", 400);
      }

      const deleted = await this.knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .where({ id, userId })
        .del();

      if (deleted === 0) {
        throw new ApiError("Estratégia não encontrada", 404);
      }
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }
}
