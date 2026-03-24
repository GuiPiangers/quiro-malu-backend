import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
    table.dateTime("reminderSentAt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
    table.dropColumn("reminderSentAt");
  });
}
