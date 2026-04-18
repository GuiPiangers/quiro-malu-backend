import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

/**
 * Estratégias de envio + vínculo por campanha (`campaignId` = id da config de
 * mensagem: aniversário, pré ou pós-agendamento). PK `(userId, campaignId)`.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ETableNames.MESSAGE_SEND_STRATEGIES, (table) => {
    table.string("id", 100).primary().index();
    table.string("userId", 100).index().notNullable();
    table.string("kind", 80).notNullable();
    table.json("params").notNullable();
    table.timestamps(true, true);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable(ETableNames.USER_MESSAGE_SEND_STRATEGY, (table) => {
    table.string("userId", 100).notNullable();
    table.string("campaignId", 100).notNullable();
    table.string("strategyId", 100).notNullable().index();
    table.timestamps(true, true);
    table.primary(["userId", "campaignId"]);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("strategyId")
      .references("id")
      .inTable(ETableNames.MESSAGE_SEND_STRATEGIES)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ETableNames.USER_MESSAGE_SEND_STRATEGY);
  await knex.schema.dropTableIfExists(ETableNames.MESSAGE_SEND_STRATEGIES);
}
