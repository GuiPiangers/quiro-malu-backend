import type { Knex } from "knex";

/**
 * Antes: seed de linha em `message_send_strategies` só para satisfazer FK.
 * Agora: sem efeito — vínculo “único por paciente” em `user_campaign_unique_send_strategy`
 * (migration `20260503120000_user_campaign_unique_send_strategy_table.ts`).
 */
export async function up(_knex: Knex): Promise<void> {}

export async function down(_knex: Knex): Promise<void> {}
