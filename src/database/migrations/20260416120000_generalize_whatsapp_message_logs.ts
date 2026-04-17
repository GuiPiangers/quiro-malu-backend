import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

/** Nome explícito: o default do Knex excede o limite de 64 caracteres do MySQL. */
const SCHEDULE_COMPOSITE_INDEX = "idx_wm_logs_sch_type_cfg";

async function hasScheduleColumnsCompositeIndex(
  knex: Knex,
  tableName: string,
): Promise<boolean> {
  const result = await knex.raw(
    `
    SELECT 1 AS ok
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME IN ('scheduleMessageType', 'scheduleMessageConfigId')
    GROUP BY INDEX_NAME
    HAVING COUNT(DISTINCT COLUMN_NAME) = 2
    LIMIT 1
    `,
    [tableName],
  );
  const rows = result[0] as unknown;
  return Array.isArray(rows) && rows.length > 0;
}

/**
 * Idempotente: se a migration falhou após o ALTER ou o schema já foi aplicado manualmente,
 * colunas `scheduleMessageType` / `scheduleMessageConfigId` podem já existir sem registro em `knex_migrations`.
 */
export async function up(knex: Knex): Promise<void> {
  const t = ETableNames.WHATSAPP_MESSAGE_LOGS;
  const hasScheduleMessageType = await knex.schema.hasColumn(
    t,
    "scheduleMessageType",
  );
  const hasScheduleMessageConfigId = await knex.schema.hasColumn(
    t,
    "scheduleMessageConfigId",
  );

  if (!hasScheduleMessageType || !hasScheduleMessageConfigId) {
    await knex.schema.alterTable(t, (table) => {
      if (!hasScheduleMessageType) {
        table
          .string("scheduleMessageType", 32)
          .notNullable()
          .defaultTo("beforeSchedule")
          .index();
      }
      if (!hasScheduleMessageConfigId) {
        table
          .string("scheduleMessageConfigId", 100)
          .notNullable()
          .defaultTo("")
          .index();
      }
    });

    await knex.schema.alterTable(t, (table) => {
      table.index(
        ["scheduleMessageType", "scheduleMessageConfigId"],
        SCHEDULE_COMPOSITE_INDEX,
      );
    });
  } else if (
    hasScheduleMessageType &&
    hasScheduleMessageConfigId &&
    !(await hasScheduleColumnsCompositeIndex(knex, t))
  ) {
    await knex.schema.alterTable(t, (table) => {
      table.index(
        ["scheduleMessageType", "scheduleMessageConfigId"],
        SCHEDULE_COMPOSITE_INDEX,
      );
    });
  }

  if (await knex.schema.hasColumn(t, "beforeScheduleMessageId")) {
    await knex(t).update({
      scheduleMessageType: "beforeSchedule",
      scheduleMessageConfigId: knex.ref("beforeScheduleMessageId"),
    });

    await knex.schema.alterTable(t, (table) => {
      table.string("beforeScheduleMessageId", 100).nullable().alter();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const t = ETableNames.WHATSAPP_MESSAGE_LOGS;

  if (
    (await knex.schema.hasColumn(t, "scheduleMessageType")) &&
    (await knex.schema.hasColumn(t, "scheduleMessageConfigId")) &&
    (await hasScheduleColumnsCompositeIndex(knex, t))
  ) {
    await knex.schema.alterTable(t, (table) => {
      table.dropIndex(
        ["scheduleMessageType", "scheduleMessageConfigId"],
        SCHEDULE_COMPOSITE_INDEX,
      );
    });
  }

  if (await knex.schema.hasColumn(t, "scheduleMessageType")) {
    await knex.schema.alterTable(t, (table) => {
      table.dropColumn("scheduleMessageType");
    });
  }

  if (await knex.schema.hasColumn(t, "scheduleMessageConfigId")) {
    await knex.schema.alterTable(t, (table) => {
      table.dropColumn("scheduleMessageConfigId");
    });
  }

  if (await knex.schema.hasColumn(t, "beforeScheduleMessageId")) {
    await knex.schema.alterTable(t, (table) => {
      table.string("beforeScheduleMessageId", 100).notNullable().alter();
    });
  }
}
