import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

async function hasClinicForeignKey(knex: Knex): Promise<boolean> {
  const [rows] = await knex.raw(
    `select CONSTRAINT_NAME
       from information_schema.KEY_COLUMN_USAGE
      where TABLE_SCHEMA = database()
        and TABLE_NAME = ?
        and COLUMN_NAME = 'clinicId'
        and REFERENCED_TABLE_NAME = ?`,
    [ETableNames.SCHEDULES, ETableNames.CLINICS],
  )

  return rows.length > 0
}

export async function up(knex: Knex): Promise<void> {
  const hasClinicId = await knex.schema.hasColumn(
    ETableNames.SCHEDULES,
    'clinicId',
  )

  if (!hasClinicId) {
    await knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
      table.string('clinicId', 100).nullable().index()
    })
  }

  await knex.raw(
    `update ?? as s
      join ?? as u on u.id = s.userId
       set s.clinicId = u.clinicId
     where s.clinicId is null`,
    [ETableNames.SCHEDULES, ETableNames.USERS],
  )

  await knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
    table.string('clinicId', 100).notNullable().alter()
  })

  if (await hasClinicForeignKey(knex)) return

  await knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
    table
      .foreign('clinicId')
      .references('id')
      .inTable(ETableNames.CLINICS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  const hasClinicId = await knex.schema.hasColumn(
    ETableNames.SCHEDULES,
    'clinicId',
  )

  if (!hasClinicId) return

  if (await hasClinicForeignKey(knex)) {
    await knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
      table.dropForeign(['clinicId'])
    })
  }

  await knex.schema.alterTable(ETableNames.SCHEDULES, (table) => {
    table.dropColumn('clinicId')
  })
}
