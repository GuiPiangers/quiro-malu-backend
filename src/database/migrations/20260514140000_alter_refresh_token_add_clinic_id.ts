import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

const FK_REFRESH_TOKEN_CLINIC = "fk_refresh_token_clinic_id";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(
    ETableNames.REFRESH_TOKEN,
    "clinicId",
  );
  if (!hasColumn) {
    await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
      table.string("clinicId", 100).nullable().index();
    });
  }

  await knex.raw(`
    UPDATE ?? AS rt
    INNER JOIN ?? AS u ON u.id = rt.userId
    SET rt.clinicId = u.clinicId
    WHERE rt.clinicId IS NULL`,
    [ETableNames.REFRESH_TOKEN, ETableNames.USERS],
  );

  await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
    table.string("clinicId", 100).notNullable().alter();
  });

  const [rows] = await knex.raw(
    `select CONSTRAINT_NAME
       from information_schema.KEY_COLUMN_USAGE
      where TABLE_SCHEMA = database()
        and TABLE_NAME = ?
        and COLUMN_NAME = 'clinicId'
        and REFERENCED_TABLE_NAME = ?`,
    [ETableNames.REFRESH_TOKEN, ETableNames.CLINICS],
  );

  if (!rows?.length) {
    await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
      table
        .foreign("clinicId", FK_REFRESH_TOKEN_CLINIC)
        .references("id")
        .inTable(ETableNames.CLINICS)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }
}

async function hasRefreshTokenClinicForeignKey(knex: Knex): Promise<boolean> {
  const [rows] = await knex.raw(
    `select CONSTRAINT_NAME
       from information_schema.TABLE_CONSTRAINTS
      where TABLE_SCHEMA = database()
        and TABLE_NAME = ?
        and CONSTRAINT_TYPE = 'FOREIGN KEY'
        and CONSTRAINT_NAME = ?`,
    [ETableNames.REFRESH_TOKEN, FK_REFRESH_TOKEN_CLINIC],
  );
  return rows.length > 0;
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(
    ETableNames.REFRESH_TOKEN,
    "clinicId",
  );
  if (!hasColumn) return;

  if (await hasRefreshTokenClinicForeignKey(knex)) {
    await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
      table.dropForeign(["clinicId"], FK_REFRESH_TOKEN_CLINIC);
    });
  }

  await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
    table.dropColumn("clinicId");
  });
}
