import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const UQ_USER_FP = "uq_user_fingerprints_user_fp";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ETableNames.USER_FINGERPRINTS, (table) => {
    table.increments("id").primary();
    table.string("userId", 100).notNullable().index();
    table.string("fpHash", 64).notNullable();
    table.timestamp("lastUsed").notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.unique(["userId", "fpHash"], UQ_USER_FP);
    table
      .foreign("userId")
      .references("id")
      .inTable(ETableNames.USERS)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ETableNames.USER_FINGERPRINTS);
}
