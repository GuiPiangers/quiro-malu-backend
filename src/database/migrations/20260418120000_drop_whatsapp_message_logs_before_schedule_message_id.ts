import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  const t = ETableNames.WHATSAPP_MESSAGE_LOGS;
  if (await knex.schema.hasColumn(t, "beforeScheduleMessageId")) {
    await knex.schema.alterTable(t, (table) => {
      table.dropColumn("beforeScheduleMessageId");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.WHATSAPP_MESSAGE_LOGS, (table) => {
    table.string("beforeScheduleMessageId", 100).nullable().index();
  });
}
