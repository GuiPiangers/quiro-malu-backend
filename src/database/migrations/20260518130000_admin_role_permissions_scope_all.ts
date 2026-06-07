import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

export async function up(knex: Knex): Promise<void> {
  const systemRoleIds = await knex(ETableNames.ROLES)
    .where({ isSystem: true })
    .pluck<string>('id')

  if (systemRoleIds.length === 0) return

  await knex(ETableNames.ROLE_PERMISSIONS)
    .whereIn('roleId', systemRoleIds)
    .whereNull('scope')
    .update({ scope: JSON.stringify({ type: 'all' }) })
}

export async function down(knex: Knex): Promise<void> {
  const systemRoleIds = await knex(ETableNames.ROLES)
    .where({ isSystem: true })
    .pluck<string>('id')

  if (systemRoleIds.length === 0) return

  await knex(ETableNames.ROLE_PERMISSIONS)
    .whereIn('roleId', systemRoleIds)
    .whereRaw(`scope = ?`, [JSON.stringify({ type: 'all' })])
    .update({ scope: null })
}
