import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.REFRESH_TOKEN, (table) => {
    table.string("id", 100).primary().index();
    table.string("userId", 100).index().notNullable();
    table.integer("expiresIn").notNullable();
    table.timestamps(true, true);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.REFRESH_TOKEN);
}
