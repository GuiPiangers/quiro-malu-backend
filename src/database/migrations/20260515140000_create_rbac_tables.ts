import type { Knex } from 'knex'
import { randomUUID } from 'node:crypto'
import { ETableNames } from '../ETableNames'
import { SYSTEM_PERMISSIONS } from '../seeds/permissions.seed'

const ADMIN_ROLE_NAME = 'Administrador'

export async function up(knex: Knex): Promise<void> {
  const hasPermissions = await knex.schema.hasTable(ETableNames.PERMISSIONS)
  if (!hasPermissions) {
    await knex.schema.createTable(ETableNames.PERMISSIONS, (table) => {
      table.string('id', 100).primary().index()
      table.string('key', 60).notNullable().unique()
      table.string('module', 40).notNullable()
      table.specificType('action', "enum('read','write')").notNullable()
      table.string('description', 200).notNullable().defaultTo('')
      table.timestamps(true, true)
    })
  }

  const hasRoles = await knex.schema.hasTable(ETableNames.ROLES)
  if (!hasRoles) {
    await knex.schema.createTable(ETableNames.ROLES, (table) => {
      table.string('id', 100).primary().index()
      table
        .string('clinicId', 100)
        .notNullable()
        .index()
        .references('id')
        .inTable(ETableNames.CLINICS)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('name', 80).notNullable()
      table.string('description', 200).notNullable().defaultTo('')
      table.boolean('isSystem').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
  }

  const hasRp = await knex.schema.hasTable(ETableNames.ROLE_PERMISSIONS)
  if (!hasRp) {
    await knex.schema.createTable(ETableNames.ROLE_PERMISSIONS, (table) => {
      table.string('id', 100).primary().index()
      table
        .string('roleId', 100)
        .notNullable()
        .index()
        .references('id')
        .inTable(ETableNames.ROLES)
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
      table.unique(['roleId', 'permissionId'])
      table.timestamps(true, true)
    })
  }

  const hasUserRoleId = await knex.schema.hasColumn(ETableNames.USERS, 'roleId')
  if (!hasUserRoleId) {
    await knex.schema.alterTable(ETableNames.USERS, (table) => {
      table
        .string('roleId', 100)
        .nullable()
        .index()
        .references('id')
        .inTable(ETableNames.ROLES)
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  const permCountRow = await knex(ETableNames.PERMISSIONS)
    .count<{ c: string }>('* as c')
    .first()
  const permCount = permCountRow ? Number(permCountRow.c) : 0
  if (permCount === 0) {
    const rows = SYSTEM_PERMISSIONS.map((p) => ({
      id: randomUUID(),
      key: p.key,
      module: p.module,
      action: p.action,
      description: p.description,
    }))
    await knex(ETableNames.PERMISSIONS).insert(rows)
  }

  const allPermIds = (await knex(ETableNames.PERMISSIONS).select('id')) as {
    id: string
  }[]
  const clinics = (await knex(ETableNames.CLINICS).select('id')) as {
    id: string
  }[]

  for (const { id: clinicId } of clinics) {
    let existingSystem = await knex(ETableNames.ROLES)
      .first<{ id: string }>('id')
      .where({ clinicId, isSystem: true })

    if (!existingSystem) {
      const byName = await knex(ETableNames.ROLES)
        .first<{ id: string }>('id')
        .where({ clinicId, name: ADMIN_ROLE_NAME })
      if (byName) {
        await knex(ETableNames.ROLES)
          .update({ isSystem: true })
          .where({ id: byName.id })
        existingSystem = byName
      }
    }

    let roleId: string
    if (existingSystem) {
      roleId = existingSystem.id
    } else {
      roleId = randomUUID()
      await knex(ETableNames.ROLES).insert({
        id: roleId,
        clinicId,
        name: ADMIN_ROLE_NAME,
        description: 'Acesso total (papel de sistema)',
        isSystem: true,
      })
      const rpRows = allPermIds.map((perm) => ({
        id: randomUUID(),
        roleId,
        permissionId: perm.id,
        scope: null,
      }))
      if (rpRows.length) {
        await knex(ETableNames.ROLE_PERMISSIONS).insert(rpRows)
      }
    }

    await knex(ETableNames.USERS)
      .update({ roleId })
      .where({ clinicId })
      .whereNull('roleId')
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasUserRoleId = await knex.schema.hasColumn(ETableNames.USERS, 'roleId')
  if (hasUserRoleId) {
    await knex.schema.alterTable(ETableNames.USERS, (table) => {
      table.dropForeign(['roleId'])
      table.dropColumn('roleId')
    })
  }

  await knex.schema.dropTableIfExists(ETableNames.ROLE_PERMISSIONS)
  await knex.schema.dropTableIfExists(ETableNames.ROLES)
  await knex.schema.dropTableIfExists(ETableNames.PERMISSIONS)
}
