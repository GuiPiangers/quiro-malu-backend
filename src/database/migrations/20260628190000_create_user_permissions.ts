import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(ETableNames.USER_PERMISSIONS)
  if (hasTable) return

  await knex.schema.createTable(ETableNames.USER_PERMISSIONS, (table) => {
    table.string('id', 100).primary().index()
    table
      .string('userId', 100)
      .notNullable()
      .index()
      .references('id')
      .inTable(ETableNames.USERS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table
      .string('permissionId', 100)
      .notNullable()
      .index()
      .references('id')
      .inTable(ETableNames.PERMISSIONS)
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.json('scope')
    table.unique(['userId', 'permissionId'])
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ETableNames.USER_PERMISSIONS)
}
