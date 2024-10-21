import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.USERS, (table) => {
      table.string("id", 100).primary().index();
      table.string("name", 50).notNullable();
      table.string("email", 50).unique();
      table.string("phone", 18);
      table.string("password", 50).notNullable();
    })
    .then(() => {
      console.log(`Created table ${ETableNames.USERS}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable(ETableNames.USERS);
}
