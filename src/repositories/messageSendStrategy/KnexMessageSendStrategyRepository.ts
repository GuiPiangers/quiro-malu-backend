import { Knex } from "../../database/knex";
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

function bindingsCountSubquery(strategyTableRef: string) {
  return Knex.raw(
    `(SELECT COUNT(*) FROM \`${ETableNames.USER_MESSAGE_SEND_STRATEGY}\` u WHERE u.strategyId = ${strategyTableRef}) AS campaignBindingsCount`,
  );
}

export class KnexMessageSendStrategyRepository
  implements IMessageSendStrategyRepository
{
  async listByUserIdPaged(
    data: ListMessageSendStrategiesByUserIdProps,
  ): Promise<ListMessageSendStrategiesByUserIdResult> {
    try {
      const base = () =>
        Knex(ETableNames.MESSAGE_SEND_STRATEGIES).where({ userId: data.userId });

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
          bindingsCountSubquery(strategyTable),
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
      await Knex(ETableNames.MESSAGE_SEND_STRATEGIES).insert({
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
      const strategyTable = `\`${ETableNames.MESSAGE_SEND_STRATEGIES}\`.id`;
      const row = await Knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .select(
          "id",
          "userId",
          "name",
          "kind",
          "params",
          bindingsCountSubquery(strategyTable),
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

  async findActiveStrategyByUserAndCampaign(
    userId: string,
    campaignId: string,
  ): Promise<MessageSendStrategyRow | null> {
    try {
      const row = await Knex(`${ETableNames.MESSAGE_SEND_STRATEGIES} as s`)
        .innerJoin(
          `${ETableNames.USER_MESSAGE_SEND_STRATEGY} as u`,
          "u.strategyId",
          "s.id",
        )
        .select(
          "s.id",
          "s.userId",
          "s.name",
          "s.kind",
          "s.params",
          bindingsCountSubquery("s.id"),
        )
        .where("u.userId", userId)
        .andWhere("u.campaignId", campaignId)
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

  async upsertCampaignBinding(
    userId: string,
    campaignId: string,
    strategyId: string,
  ): Promise<void> {
    try {
      await Knex.transaction(async (trx) => {
        await trx(ETableNames.USER_MESSAGE_SEND_STRATEGY)
          .where({ userId, campaignId })
          .del();
        await trx(ETableNames.USER_MESSAGE_SEND_STRATEGY).insert({
          userId,
          campaignId,
          strategyId,
        });
      });
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
      const row: Record<string, unknown> = {};
      if (patch.name !== undefined) {
        row.name = patch.name;
      }
      if (patch.kind !== undefined) {
        row.kind = patch.kind;
      }
      if (patch.params !== undefined) {
        // Avoid Knex flattening `{ params: { amount } }` into a bogus `amount` column.
        row.params = JSON.stringify(patch.params);
      }

      if (Object.keys(row).length === 0) {
        return;
      }

      const updated = await Knex(ETableNames.MESSAGE_SEND_STRATEGIES)
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
      const deleted = await Knex(ETableNames.MESSAGE_SEND_STRATEGIES)
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
