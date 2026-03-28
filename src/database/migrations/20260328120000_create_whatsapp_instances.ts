import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.WHATSAPP_INSTANCES, (table) => {
    table.string("id", 36).primary().index();
    table.string("userId", 36).notNullable().unique().index();
    table.string("instanceName", 255).notNullable().unique();
    table.string("phoneNumber", 20).nullable();
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
  return knex.schema.dropTable(ETableNames.WHATSAPP_INSTANCES);
}
