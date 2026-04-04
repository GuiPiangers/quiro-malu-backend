import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.BEFORE_SCHEDULE_MESSAGES, (table) => {
    table.string("name", 255).notNullable().defaultTo("");
    table.index(["userId", "name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.BEFORE_SCHEDULE_MESSAGES, (table) => {
    table.dropIndex(["userId", "name"]);
    table.dropColumn("name");
  });
}
