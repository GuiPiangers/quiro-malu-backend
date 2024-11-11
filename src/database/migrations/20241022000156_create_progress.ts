import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.PROGRESS, (table) => {
    table.string("id", 100).primary().index();
    table.string("patientId", 100).index().notNullable();
    table.string("userId", 100).index().notNullable();
    table.string("service", 100).index().notNullable();
    table.text("actualProblem");
    table.text("procedures");
    table.datetime("date");
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
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.PROGRESS);
}
