import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.WHATSAPP_MESSAGE_LOGS, (table) => {
    table.string("id", 100).primary().index();
    table.string("userId", 100).notNullable().index();
    table.string("patientId", 100).notNullable().index();
    table.string("schedulingId", 100).notNullable().index();
    table.string("beforeScheduleMessageId", 100).notNullable().index();
    table.text("message").notNullable();
    table.string("toPhone", 32).notNullable();
    table.string("instanceName", 255).notNullable();
    table
      .string("status", 32)
      .notNullable()
      .index();
    table.string("providerMessageId", 255).nullable().unique().index();
    table.text("errorMessage").nullable();
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
  return knex.schema.dropTable(ETableNames.WHATSAPP_MESSAGE_LOGS);
}
