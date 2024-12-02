import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PATIENTS, (table) => {
    table.string("profession").nullable();
    table.string("maritalStatus").nullable();
    table.string("education").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PATIENTS, (table) => {
    table.dropColumn("profession");
    table.dropColumn("maritalStatus");
    table.dropColumn("education");
  });
}
