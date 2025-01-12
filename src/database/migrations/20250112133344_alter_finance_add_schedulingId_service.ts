import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.FINANCES, (table) => {
    table.string("schedulingId", 100).nullable();
    table.string("service", 50).nullable().index();
    table
      .foreign("schedulingId")
      .references("id")
      .inTable(ETableNames.SCHEDULES)
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.FINANCES, (table) => {
    table.dropColumn("schedulingId");
    table.dropColumn("service");
  });
}
