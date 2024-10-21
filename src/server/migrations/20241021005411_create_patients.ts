import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.PATIENTS, (table) => {
      table.string("id", 100).primary().index();
      table.string("name", 50).notNullable();
      table.string("phone", 18);
      table.date("dateOfBirth");
      table.string("gender", 10);
      table.string("cpf", 14);
      table.string("userId", 100).index().notNullable();
      table
        .foreign("userId")
        .references("id")
        .inTable(ETableNames.USERS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`Created table ${ETableNames.PATIENTS}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.PATIENTS);
}
