import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

const DEFAULT_CLINIC_ID = '00000000-0000-4000-8000-000000000001'
const DEFAULT_CLINIC_NAME = 'Quiro Malu'

const clinicScopedTables = [
  ETableNames.PATIENTS,
  ETableNames.LOCATIONS,
  ETableNames.ANAMNESIS,
  ETableNames.DIAGNOSTICS,
  ETableNames.PROGRESS,
  ETableNames.SERVICES,
  ETableNames.FINANCES,
]

export const config = { transaction: false }

async function ensureClinicsTable(knex: Knex): Promise<void> {
  const hasClinicsTable = await knex.schema.hasTable(ETableNames.CLINICS)
  if (hasClinicsTable) return

  await knex.schema.createTable(ETableNames.CLINICS, (table) => {
    table.string('id', 100).primary().index()
    table.string('name', 120).notNullable().unique()
    table.timestamps(true, true)
  })
}

async function ensureClinicIdColumn(
  knex: Knex,
  tableName: ETableNames,
): Promise<void> {
  const hasClinicId = await knex.schema.hasColumn(tableName, 'clinicId')
  if (hasClinicId) return

  await knex.schema.alterTable(tableName, (table) => {
    table.string('clinicId', 100).nullable().index()
  })
}

async function makeLegacyUserIdNullable(
  knex: Knex,
  tableName: ETableNames,
): Promise<void> {
  const hasUserId = await knex.schema.hasColumn(tableName, 'userId')
  if (!hasUserId) return

  await knex.schema.alterTable(tableName, (table) => {
    table.string('userId', 100).nullable().alter()
  })
}

async function hasClinicForeignKey(
  knex: Knex,
  tableName: ETableNames,
): Promise<boolean> {
  const [rows] = await knex.raw(
    `select CONSTRAINT_NAME
       from information_schema.KEY_COLUMN_USAGE
      where TABLE_SCHEMA = database()
        and TABLE_NAME = ?
        and COLUMN_NAME = 'clinicId'
        and REFERENCED_TABLE_NAME = ?`,
    [tableName, ETableNames.CLINICS],
  )

  return rows.length > 0
}

async function ensureClinicForeignKey(
  knex: Knex,
  tableName: ETableNames,
): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('clinicId', 100).notNullable().alter()
  })

  if (await hasClinicForeignKey(knex, tableName)) return

  await knex.schema.alterTable(tableName, (table) => {
    table
      .foreign('clinicId')
      .references('id')
      .inTable(ETableNames.CLINICS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

async function getOrCreateDefaultClinicId(knex: Knex): Promise<string> {
  const existingClinic = await knex(ETableNames.CLINICS)
    .select('id')
    .where({ name: DEFAULT_CLINIC_NAME })
    .first()

  if (existingClinic?.id) return existingClinic.id

  await knex(ETableNames.CLINICS).insert({
    id: DEFAULT_CLINIC_ID,
    name: DEFAULT_CLINIC_NAME,
  })

  return DEFAULT_CLINIC_ID
}

async function dropClinicForeignKeys(
  knex: Knex,
  tableName: ETableNames,
): Promise<void> {
  const [rows] = await knex.raw(
    `select CONSTRAINT_NAME
       from information_schema.KEY_COLUMN_USAGE
      where TABLE_SCHEMA = database()
        and TABLE_NAME = ?
        and COLUMN_NAME = 'clinicId'
        and REFERENCED_TABLE_NAME = ?`,
    [tableName, ETableNames.CLINICS],
  )

  for (const row of rows) {
    await knex.schema.alterTable(tableName, (table) => {
      table.dropForeign(['clinicId'], row.CONSTRAINT_NAME)
    })
  }
}

async function dropClinicId(
  knex: Knex,
  tableName: ETableNames,
): Promise<void> {
  const hasClinicId = await knex.schema.hasColumn(tableName, 'clinicId')
  if (!hasClinicId) return

  await dropClinicForeignKeys(knex, tableName)
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('clinicId')
  })
}

export async function up(knex: Knex): Promise<void> {
  await ensureClinicsTable(knex)
  await ensureClinicIdColumn(knex, ETableNames.USERS)

  for (const tableName of clinicScopedTables) {
    await ensureClinicIdColumn(knex, tableName)
    await makeLegacyUserIdNullable(knex, tableName)
  }

  const clinicId = await getOrCreateDefaultClinicId(knex)

  await knex(ETableNames.USERS).update({ clinicId })

  for (const tableName of clinicScopedTables) {
    await knex(tableName).update({ clinicId })
  }

  await ensureClinicForeignKey(knex, ETableNames.USERS)
  for (const tableName of clinicScopedTables) {
    await ensureClinicForeignKey(knex, tableName)
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const tableName of [...clinicScopedTables].reverse()) {
    await dropClinicId(knex, tableName)
  }

  await dropClinicId(knex, ETableNames.USERS)

  const hasClinicsTable = await knex.schema.hasTable(ETableNames.CLINICS)
  if (hasClinicsTable) {
    await knex.schema.dropTable(ETableNames.CLINICS)
  }
}
