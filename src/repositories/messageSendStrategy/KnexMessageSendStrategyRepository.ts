import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IMessageSendStrategyRepository,
  MessageSendStrategyRow,
  SaveMessageSendStrategyProps,
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

export class KnexMessageSendStrategyRepository
  implements IMessageSendStrategyRepository
{
  async listByUserId(userId: string): Promise<MessageSendStrategyRow[]> {
    try {
      const rows = await Knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .select("id", "userId", "kind", "params")
        .where({ userId })
        .orderBy("created_at", "desc");

      return rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        kind: row.kind,
        params: parseParams(row.params),
      }));
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async save(data: SaveMessageSendStrategyProps): Promise<void> {
    try {
      await Knex(ETableNames.MESSAGE_SEND_STRATEGIES).insert({
        id: data.id,
        userId: data.userId,
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
      const row = await Knex(ETableNames.MESSAGE_SEND_STRATEGIES)
        .select("id", "userId", "kind", "params")
        .where({ id, userId })
        .first();

      if (!row) return null;

      return {
        id: row.id,
        userId: row.userId,
        kind: row.kind,
        params: parseParams(row.params),
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
        .select("s.id", "s.userId", "s.kind", "s.params")
        .where("u.userId", userId)
        .andWhere("u.campaignId", campaignId)
        .first();

      if (!row) return null;

      return {
        id: row.id,
        userId: row.userId,
        kind: row.kind,
        params: parseParams(row.params),
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
