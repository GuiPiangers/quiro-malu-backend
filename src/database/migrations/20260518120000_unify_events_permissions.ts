import type { Knex } from 'knex'
import { randomUUID } from 'node:crypto'
import { ETableNames } from '../ETableNames'

const LEGACY_READ_KEYS = ['schedules:read', 'block_schedules:read']
const LEGACY_WRITE_KEYS = ['schedules:write', 'block_schedules:write']
const EVENTS_READ_KEY = 'events:read'
const EVENTS_WRITE_KEY = 'events:write'

async function ensurePermission(
  knex: Knex,
  row: {
    key: string
    module: string
    action: 'read' | 'write'
    description: string
  },
): Promise<string> {
  const existing = await knex(ETableNames.PERMISSIONS)
    .first<{ id: string }>('id')
    .where({ key: row.key })

  if (existing) {
    await knex(ETableNames.PERMISSIONS)
      .update({
        module: row.module,
        action: row.action,
        description: row.description,
      })
      .where({ id: existing.id })
    return existing.id
  }

  const id = randomUUID()
  await knex(ETableNames.PERMISSIONS).insert({
    id,
    key: row.key,
    module: row.module,
    action: row.action,
    description: row.description,
  })
  return id
}

async function migrateRolePermissions(
  knex: Knex,
  legacyPermissionIds: string[],
  targetPermissionId: string,
): Promise<void> {
  if (legacyPermissionIds.length === 0) return

  const roleIds = await knex(ETableNames.ROLE_PERMISSIONS)
    .whereIn('permissionId', legacyPermissionIds)
    .distinct('roleId')
    .pluck<string>('roleId')

  for (const roleId of roleIds) {
    const alreadyHasTarget = await knex(ETableNames.ROLE_PERMISSIONS)
      .first('id')
      .where({ roleId, permissionId: targetPermissionId })

    if (alreadyHasTarget) continue

    const legacyRow = await knex(ETableNames.ROLE_PERMISSIONS)
      .first<{ scope: unknown }>('scope')
      .where({ roleId })
      .whereIn('permissionId', legacyPermissionIds)

    await knex(ETableNames.ROLE_PERMISSIONS).insert({
      id: randomUUID(),
      roleId,
      permissionId: targetPermissionId,
      scope: legacyRow?.scope ?? null,
    })
  }
}

export async function up(knex: Knex): Promise<void> {
  const eventsReadId = await ensurePermission(knex, {
    key: EVENTS_READ_KEY,
    module: 'events',
    action: 'read',
    description:
      'Consultar agendamentos, bloqueios de agenda, eventos e sugestões',
  })

  const eventsWriteId = await ensurePermission(knex, {
    key: EVENTS_WRITE_KEY,
    module: 'events',
    action: 'write',
    description:
      'Criar e alterar agendamentos, bloqueios de agenda e configuração de calendário',
  })

  const legacyReadIds = (
    await knex(ETableNames.PERMISSIONS)
      .whereIn('key', LEGACY_READ_KEYS)
      .select('id')
  ).map((row: { id: string }) => row.id)

  const legacyWriteIds = (
    await knex(ETableNames.PERMISSIONS)
      .whereIn('key', LEGACY_WRITE_KEYS)
      .select('id')
  ).map((row: { id: string }) => row.id)

  await migrateRolePermissions(knex, legacyReadIds, eventsReadId)
  await migrateRolePermissions(knex, legacyWriteIds, eventsWriteId)

  const legacyKeys = [...LEGACY_READ_KEYS, ...LEGACY_WRITE_KEYS]
  const legacyIds = [...legacyReadIds, ...legacyWriteIds]

  if (legacyIds.length > 0) {
    await knex(ETableNames.ROLE_PERMISSIONS)
      .whereIn('permissionId', legacyIds)
      .del()
    await knex(ETableNames.PERMISSIONS).whereIn('key', legacyKeys).del()
  }
}

export async function down(knex: Knex): Promise<void> {
  const legacyPermissions = [
    {
      key: 'schedules:read',
      module: 'schedules',
      action: 'read' as const,
      description: 'Consultar agendamentos',
    },
    {
      key: 'schedules:write',
      module: 'schedules',
      action: 'write' as const,
      description: 'Criar e alterar agendamentos',
    },
    {
      key: 'block_schedules:read',
      module: 'block_schedules',
      action: 'read' as const,
      description: 'Consultar bloqueios de agenda',
    },
    {
      key: 'block_schedules:write',
      module: 'block_schedules',
      action: 'write' as const,
      description: 'Criar e alterar bloqueios de agenda',
    },
  ]

  const legacyIds: string[] = []
  for (const permission of legacyPermissions) {
    legacyIds.push(await ensurePermission(knex, permission))
  }

  const eventsReadId = (
    await knex(ETableNames.PERMISSIONS)
      .first<{ id: string }>('id')
      .where({ key: EVENTS_READ_KEY })
  )?.id

  const eventsWriteId = (
    await knex(ETableNames.PERMISSIONS)
      .first<{ id: string }>('id')
      .where({ key: EVENTS_WRITE_KEY })
  )?.id

  if (eventsReadId) {
    await migrateRolePermissions(
      knex,
      [eventsReadId],
      legacyIds[0]!,
    )
  }

  if (eventsWriteId) {
    await migrateRolePermissions(
      knex,
      [eventsWriteId],
      legacyIds[1]!,
    )
  }

  await knex(ETableNames.PERMISSIONS)
    .update({
      description: 'Consultar eventos e sugestões',
    })
    .where({ key: EVENTS_READ_KEY })

  if (eventsWriteId) {
    await knex(ETableNames.ROLE_PERMISSIONS)
      .where({ permissionId: eventsWriteId })
      .del()
    await knex(ETableNames.PERMISSIONS)
      .where({ key: EVENTS_WRITE_KEY })
      .del()
  }
}
