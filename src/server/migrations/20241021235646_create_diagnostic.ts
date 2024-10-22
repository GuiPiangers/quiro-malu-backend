import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.DIAGNOSTICS, (table) => {
    table.string("id", 100).primary().index();
    table.string("patientId", 100).index().notNullable();
    table.string("userId", 100).index().notNullable();
    table.text("diagnostic");
    table.text("treatmentPlan");
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
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.DIAGNOSTICS);
}
