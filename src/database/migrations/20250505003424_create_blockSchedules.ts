import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.BLOCK_SCHEDULES, (table) => {
    table.string("id", 100).primary();
    table.string("userId", 100).index().notNullable();
    table.dateTime("startDate");
    table.dateTime("endDate");
    table.string("description", 200);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.BLOCK_SCHEDULES);
}
