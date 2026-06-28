import type { Knex } from 'knex'
import { randomUUID } from 'node:crypto'
import { ETableNames } from '../ETableNames'

const CLINICAL_READ_KEY = 'patients_clinical_data:read'
const CLINICAL_WRITE_KEY = 'patients_clinical_data:write'

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

export async function up(knex: Knex): Promise<void> {
  const readPermissionId = await ensurePermission(knex, {
    key: CLINICAL_READ_KEY,
    module: 'patients_clinical_data',
    action: 'read',
    description:
      'Consultar dados clínicos dos pacientes (anamnese, evolução, diagnóstico e exames)',
  })

  const writePermissionId = await ensurePermission(knex, {
    key: CLINICAL_WRITE_KEY,
    module: 'patients_clinical_data',
    action: 'write',
    description:
      'Criar e alterar dados clínicos dos pacientes (anamnese, evolução, diagnóstico e exames)',
  })

  // Conceder as novas permissões para todos os papéis de sistema (isSystem = true) com escopo { type: 'all' }
  const systemRoleIds = await knex(ETableNames.ROLES)
    .where({ isSystem: true })
    .pluck<string>('id')

  for (const roleId of systemRoleIds) {
    const hasRead = await knex(ETableNames.ROLE_PERMISSIONS)
      .first('id')
      .where({ roleId, permissionId: readPermissionId })
    if (!hasRead) {
      await knex(ETableNames.ROLE_PERMISSIONS).insert({
        id: randomUUID(),
        roleId,
        permissionId: readPermissionId,
        scope: JSON.stringify({ type: 'all' }),
      })
    }

    const hasWrite = await knex(ETableNames.ROLE_PERMISSIONS)
      .first('id')
      .where({ roleId, permissionId: writePermissionId })
    if (!hasWrite) {
      await knex(ETableNames.ROLE_PERMISSIONS).insert({
        id: randomUUID(),
        roleId,
        permissionId: writePermissionId,
        scope: JSON.stringify({ type: 'all' }),
      })
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  const permIds = await knex(ETableNames.PERMISSIONS)
    .whereIn('key', [CLINICAL_READ_KEY, CLINICAL_WRITE_KEY])
    .pluck<string>('id')

  if (permIds.length > 0) {
    await knex(ETableNames.ROLE_PERMISSIONS)
      .whereIn('permissionId', permIds)
      .del()
    await knex(ETableNames.PERMISSIONS)
      .whereIn('id', permIds)
      .del()
  }
}
