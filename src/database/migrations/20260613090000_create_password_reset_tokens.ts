import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    ETableNames.PASSWORD_RESET_TOKENS,
    (table) => {
      table.string('id', 100).primary().index()
      table.string('userId', 100).notNullable().index()
      table.string('tokenHash', 64).notNullable().unique()
      table.dateTime('expiresAt').notNullable().index()
      table.dateTime('usedAt').nullable()
      table.dateTime('invalidatedAt').nullable()
      table.timestamps(true, true)

      table
        .foreign('userId')
        .references('id')
        .inTable(ETableNames.USERS)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    },
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ETableNames.PASSWORD_RESET_TOKENS)
}
