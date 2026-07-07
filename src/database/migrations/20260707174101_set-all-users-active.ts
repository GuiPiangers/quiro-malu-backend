import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  await knex(ETableNames.USERS)
    .where('status', 'pending')
    .where('created_at', '<', '2026-07-01')
    .update({ status: 'active' })
}

export async function down(): Promise<void> {
  // not reversible
  return Promise.resolve()
}
