import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

const UQ_REFRESH_TOKEN_USER_FP = 'uq_refresh_token_user_fingerprint'

export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.REFRESH_TOKEN).del()

  await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
    table.string('fingerprint', 255).notNullable()
    table.timestamp('lastUsedAt').nullable()
    table.unique(['userId', 'fingerprint'], UQ_REFRESH_TOKEN_USER_FP)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ETableNames.REFRESH_TOKEN, (table) => {
    table.dropUnique(['userId', 'fingerprint'], UQ_REFRESH_TOKEN_USER_FP)
    table.dropColumn('fingerprint')
    table.dropColumn('lastUsedAt')
  })
}
