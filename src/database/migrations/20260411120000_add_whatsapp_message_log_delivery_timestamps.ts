import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.WHATSAPP_MESSAGE_LOGS, (table) => {
    table.dateTime("sentAt").nullable().index();
    table.dateTime("deliveredAt").nullable().index();
    table.dateTime("readAt").nullable().index();
  });

  await knex(ETableNames.WHATSAPP_MESSAGE_LOGS).update({
    sentAt: knex.ref("created_at"),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.WHATSAPP_MESSAGE_LOGS, (table) => {
    table.dropColumn("sentAt");
    table.dropColumn("deliveredAt");
    table.dropColumn("readAt");
  });
}
