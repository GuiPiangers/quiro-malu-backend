import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    ETableNames.BEFORE_SCHEDULE_MESSAGES,
    (table) => {
      table.string("id", 100).primary().index();
      table.string("userId", 100).index().notNullable();
      table.integer("minutesBeforeSchedule").unsigned().notNullable();
      table.text("textTemplate").notNullable();
      table.boolean("isActive").notNullable().defaultTo(true);
      table.timestamps(true, true);
      table
        .foreign("userId")
        .references("id")
        .inTable(ETableNames.USERS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.BEFORE_SCHEDULE_MESSAGES);
}
