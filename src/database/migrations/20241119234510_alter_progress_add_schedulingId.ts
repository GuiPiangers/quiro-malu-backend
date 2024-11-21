import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PROGRESS, (table) => {
    table.string("schedulingId").nullable();
    table
      .foreign("schedulingId")
      .references("id")
      .inTable(ETableNames.SCHEDULES)
      .onUpdate("SET NULL")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PROGRESS, (table) => {
    table.dropForeign("schedulingId");
    table.dropColumn("schedulingId");
  });
}
