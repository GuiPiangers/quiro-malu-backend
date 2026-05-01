import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const TABLE = ETableNames.USER_MESSAGE_SEND_STRATEGY;

/**
 * Permite múltiplas estratégias por campanha: PK `(userId, campaignId, strategyId)`.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (table) => {
    table.dropPrimary();
  });
  await knex.schema.alterTable(TABLE, (table) => {
    table.primary(["userId", "campaignId", "strategyId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex(TABLE).del();
  await knex.schema.alterTable(TABLE, (table) => {
    table.dropPrimary();
  });
  await knex.schema.alterTable(TABLE, (table) => {
    table.primary(["userId", "campaignId"]);
  });
}
