import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.LOCATIONS, (table) => {
      table.string("patientId", 100).index().notNullable();
      table.string("userId", 100).index().notNullable();
      table.string("cep", 100);
      table.string("state", 100);
      table.string("city", 100);
      table.string("neighborhood", 100);
      table.string("address", 100);
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
    })
    .then(() => {
      console.log("Table created");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.LOCATIONS);
}
