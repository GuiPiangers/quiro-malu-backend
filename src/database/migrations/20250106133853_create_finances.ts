import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.FINANCES, (table) => {
    table.string("id", 100).primary().index();
    table.string("userId", 100).index().notNullable();
    table.string("patientId", 100).index().nullable();
    table.dateTime("date").notNullable();
    table.string("description", 100).index().notNullable();
    table.string("type", 15).notNullable();
    table.float("value").notNullable();
    table.string("paymentMethod", 25);
    table.timestamps(true, true);
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
  return knex.schema.dropTable(ETableNames.FINANCES);
}
