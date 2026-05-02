import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const TABLE = ETableNames.USER_MESSAGE_SEND_STRATEGY;

async function mysqlDropAllForeignKeys(knex: Knex, tableName: string): Promise<void> {
  const result = await knex.raw(
    `SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    [tableName],
  );
  const rows = result[0] as { CONSTRAINT_NAME: string }[];

  for (const row of rows) {
    await knex.raw(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``);
  }
}

/**
 * Permite múltiplas estratégias por campanha: PK `(userId, campaignId, strategyId)`.
 * MySQL não permite `DROP PRIMARY KEY` enquanto existirem FKs na tabela; removemos e recriamos as FKs.
 */
export async function up(knex: Knex): Promise<void> {
  await mysqlDropAllForeignKeys(knex, TABLE);

  await knex.schema.alterTable(TABLE, (table) => {
    table.dropPrimary();
  });

  await knex.schema.alterTable(TABLE, (table) => {
    table.primary(["userId", "campaignId", "strategyId"]);
  });

  await knex.schema.alterTable(TABLE, (table) => {
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
  await knex(TABLE).del();

  await mysqlDropAllForeignKeys(knex, TABLE);

  await knex.schema.alterTable(TABLE, (table) => {
    table.dropPrimary();
  });

  await knex.schema.alterTable(TABLE, (table) => {
    table.primary(["userId", "campaignId"]);
  });

  await knex.schema.alterTable(TABLE, (table) => {
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
