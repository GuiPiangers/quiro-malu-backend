import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.ANAMNESIS, (table) => {
    table.string("id", 100).primary().index();
    table.string("patientId", 100).index().notNullable();
    table.string("userId", 100).index().notNullable();
    table.text("mainProblem").notNullable();
    table.text("currentIllness");
    table.text("history");
    table.text("familiarHistory");
    table.text("activities");
    table.string("smoke", 8).defaultTo("Não");
    table.boolean("useMedicine").notNullable().defaultTo(false);
    table.text("medicines");
    table.boolean("underwentSurgery").notNullable().defaultTo(false);
    table.text("surgeries");
    table
      .foreign("patientId")
      .references("id")
      .inTable(ETableNames.PATIENTS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable(ETableNames.ANAMNESIS);
}
