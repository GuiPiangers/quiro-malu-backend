import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.USERS, (table) => {
    table
      .enum('status', ['pending', 'active', 'inactive'])
      .notNullable()
      .defaultTo('pending')
      .after('phone')

    table.string('password', 150).nullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.USERS, (table) => {
    table.dropColumn('status')
    table.string('password', 150).notNullable().alter()
  })
}
