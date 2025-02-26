import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.NOT_MESSAGE_PATIENTS, (table) => {
    table.string("id", 100).primary();
    table.string("messageCampaignId", 100).index();
    table.string("userId", 100).index().notNullable();
    table.string("patientId", 100).index().nullable();
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("patientId")
      .references("id")
      .inTable(ETableNames.PATIENTS)
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.NOT_MESSAGE_PATIENTS);
}
