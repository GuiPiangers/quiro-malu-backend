import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.BIRTHDAY_MESSAGES, (table) => {
    table.string("id", 100).primary().index();
    table.string("userId", 100).index().notNullable();
    table.string("name", 255).notNullable().defaultTo("");
    table.text("textTemplate").notNullable();
    table.boolean("isActive").notNullable().defaultTo(true);
    table.index(["userId", "name"]);
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
  return knex.schema.dropTable(ETableNames.BIRTHDAY_MESSAGES);
}
