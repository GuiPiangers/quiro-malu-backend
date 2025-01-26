import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.EXAMS, (table) => {
    table.boolean("deleted").defaultTo(false).index();
    table.dateTime("deletedDate").nullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.EXAMS, (table) => {
    table.dropColumn("deleted");
    table.dropColumn("deletedDate");
  });
}
