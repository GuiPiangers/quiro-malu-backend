import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists(
    ETableNames.PAIN_SCALES,
    (table) => {
      table.string("id", 100).primary();
      table.string("progressId", 100).index().notNullable();
      table.string("description", 100);
      table.integer("painLevel");
      table
        .foreign("progressId")
        .references("id")
        .inTable(ETableNames.PROGRESS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.PAIN_SCALES);
}
