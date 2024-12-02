import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PATIENTS, (table) => {
    table.string("hashData").index();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(ETableNames.PATIENTS, (table) => {
    table.dropColumn("hashData");
  });
}
