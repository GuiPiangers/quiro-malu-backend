import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.MESSAGE_SEND_STRATEGIES, (table) => {
    table.string("name", 255).notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.MESSAGE_SEND_STRATEGIES, (table) => {
    table.dropColumn("name");
  });
}
