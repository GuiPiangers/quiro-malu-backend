import type { Knex } from 'knex'
import { ETableNames } from '../ETableNames'

const ADMIN_ROLE_NAME = 'Administrador'

/**
 * Bancos que rodaram `20260515140000_create_rbac_tables` antes do campo `isSystem`.
 */
export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(ETableNames.ROLES, 'isSystem')
  if (!hasColumn) {
    await knex.schema.alterTable(ETableNames.ROLES, (table) => {
      table.boolean('isSystem').notNullable().defaultTo(false)
    })
  }

  await knex(ETableNames.ROLES).where({ name: ADMIN_ROLE_NAME }).update({ isSystem: true })
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(ETableNames.ROLES, 'isSystem')
  if (!hasColumn) return

  await knex.schema.alterTable(ETableNames.ROLES, (table) => {
    table.dropColumn('isSystem')
  })
}
