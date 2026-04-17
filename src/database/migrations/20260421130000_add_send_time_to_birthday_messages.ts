import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.BIRTHDAY_MESSAGES, (table) => {
    table.time("sendTime").notNullable().defaultTo("09:00:00");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.BIRTHDAY_MESSAGES, (table) => {
    table.dropColumn("sendTime");
  });
}
