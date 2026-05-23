import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.USERS, (table) => {
    table.string('email', 255).alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.USERS, (table) => {
    table.string('email', 50).alter()
  })
}
