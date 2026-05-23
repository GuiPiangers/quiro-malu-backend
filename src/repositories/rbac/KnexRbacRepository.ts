import type { Knex } from 'knex'
import { randomUUID } from 'node:crypto'
import { ETableNames } from '../../database/ETableNames'
import type { PermissionKey } from '../../database/seeds/permissions.seed'
import { SYSTEM_PERMISSIONS } from '../../database/seeds/permissions.seed'
import type { ResolvedPermission } from '../../types/permissions'
import { mergeScopesForSamePermission } from '../../utils/mergePermissionScopes'
import { RBAC_DEFAULT_ADMIN_ROLE_NAME } from '../../core/rbac/constants'
import { ApiError } from '../../utils/ApiError'
import type {
  IRbacRepository,
  PermissionCatalogRow,
  RolePermissionItem,
  RoleRow,
} from './IRbacRepository'

const KNOWN_PERMISSION_KEYS = new Set<string>(
  SYSTEM_PERMISSIONS.map((p) => p.key),
)

export class KnexRbacRepository implements IRbacRepository {
  constructor(private readonly knex: Knex) {}

  async findResolvedPermissionsByUser(data: {
    userId: string
    clinicId: string
  }): Promise<ResolvedPermission[]> {
    const rows = (await this.knex(`${ETableNames.ROLE_PERMISSIONS} as rp`)
      .join(`${ETableNames.ROLES} as r`, 'r.id', 'rp.roleId')
      .join(`${ETableNames.USERS} as u`, 'u.roleId', 'r.id')
      .join(`${ETableNames.PERMISSIONS} as p`, 'p.id', 'rp.permissionId')
      .where({
        'u.id': data.userId,
        'u.clinicId': data.clinicId,
        'r.clinicId': data.clinicId,
      })
      .select('p.key as key', 'rp.scope as scope')) as {
      key: string
      scope: unknown
    }[]

    const byKey = new Map<string, unknown[]>()
    for (const row of rows) {
      const list = byKey.get(row.key) ?? []
      list.push(row.scope)
      byKey.set(row.key, list)
    }

    const merged: ResolvedPermission[] = []
    for (const [key, scopes] of byKey) {
      if (!KNOWN_PERMISSION_KEYS.has(key)) continue
      merged.push({
        key: key as PermissionKey,
        scope: mergeScopesForSamePermission(scopes),
      })
    }
    return merged
  }

  async findAllPermissionsCatalog(): Promise<PermissionCatalogRow[]> {
    const rows = await this.knex(ETableNames.PERMISSIONS)
      .select('id', 'key', 'module', 'action', 'description')
      .orderBy('module', 'asc')
      .orderBy('action', 'asc')

    return rows.map((r) => ({
      id: r.id,
      key: r.key as PermissionKey,
      module: r.module,
      action: r.action,
      description: r.description,
    }))
  }

  async listRolesByClinic(clinicId: string): Promise<RoleRow[]> {
    const rows = await this.knex(ETableNames.ROLES)
      .select('id', 'clinicId', 'name', 'description', 'isSystem')
      .where({ clinicId })
      .orderBy('name', 'asc')
    return rows as RoleRow[]
  }

  async createRole(data: {
    clinicId: string
    name: string
    description?: string
  }): Promise<RoleRow> {
    const id = randomUUID()
    await this.knex(ETableNames.ROLES).insert({
      id,
      clinicId: data.clinicId,
      name: data.name.trim(),
      description: (data.description ?? '').trim(),
      isSystem: false,
    })
    const row = await this.knex(ETableNames.ROLES)
      .first<RoleRow>('id', 'clinicId', 'name', 'description', 'isSystem')
      .where({ id })
    return row!
  }

  async updateRole(data: {
    id: string
    clinicId: string
    name?: string
    description?: string
  }): Promise<void> {
    const patch: Record<string, string> = {}
    if (data.name !== undefined) patch.name = data.name.trim()
    if (data.description !== undefined)
      patch.description = data.description.trim()
    if (Object.keys(patch).length === 0) return
    await this.knex(ETableNames.ROLES).update(patch).where({
      id: data.id,
      clinicId: data.clinicId,
    })
  }

  async deleteRole(data: { id: string; clinicId: string }): Promise<void> {
    await this.knex.transaction(async (trx) => {
      await trx(ETableNames.USERS)
        .where({ roleId: data.id })
        .update({ roleId: null })
      await trx(ETableNames.ROLE_PERMISSIONS)
        .where({ roleId: data.id })
        .delete()
      await trx(ETableNames.ROLES)
        .where({ id: data.id, clinicId: data.clinicId })
        .delete()
    })
  }

  async findRoleByIdForClinic(data: {
    id: string
    clinicId: string
  }): Promise<RoleRow | null> {
    const row = await this.knex(ETableNames.ROLES)
      .first<RoleRow>('id', 'clinicId', 'name', 'description', 'isSystem')
      .where({ id: data.id, clinicId: data.clinicId })
    return row ?? null
  }

  async listRolePermissions(data: {
    roleId: string
    clinicId: string
  }): Promise<RolePermissionItem[]> {
    const ok = await this.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    })
    if (!ok) return []

    const rows = (await this.knex(`${ETableNames.ROLE_PERMISSIONS} as rp`)
      .join(`${ETableNames.PERMISSIONS} as p`, 'p.id', 'rp.permissionId')
      .where({ 'rp.roleId': data.roleId })
      .select('p.key as key', 'rp.scope as scope')) as {
      key: string
      scope: unknown
    }[]

    return rows.map((r) => ({
      permissionKey: r.key as PermissionKey,
      scope: r.scope ?? null,
    }))
  }

  async replaceRolePermissions(data: {
    roleId: string
    clinicId: string
    items: RolePermissionItem[]
  }): Promise<void> {
    const role = await this.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    })
    if (!role) {
      throw new ApiError('Papel não encontrado.', 404, 'role')
    }

    for (const item of data.items) {
      if (!KNOWN_PERMISSION_KEYS.has(item.permissionKey)) {
        throw new ApiError(
          `Permissão inválida: ${item.permissionKey}`,
          400,
          'permission',
        )
      }
    }

    const keys = data.items.map((i) => i.permissionKey)
    if (new Set(keys).size !== keys.length) {
      throw new ApiError(
        'Permissões duplicadas no corpo da requisição.',
        400,
        'permission',
      )
    }

    const permRows = (await this.knex(ETableNames.PERMISSIONS)
      .select('id', 'key')
      .whereIn('key', keys)) as { id: string; key: string }[]
    const idByKey = new Map(permRows.map((p) => [p.key, p.id]))

    await this.knex.transaction(async (trx) => {
      await trx(ETableNames.ROLE_PERMISSIONS)
        .where({ roleId: data.roleId })
        .delete()
      const inserts = data.items.map((item) => ({
        id: randomUUID(),
        roleId: data.roleId,
        permissionId: idByKey.get(item.permissionKey)!,
        scope:
          item.scope === undefined || item.scope === null
            ? null
            : (item.scope as object),
      }))
      if (inserts.length) {
        await trx(ETableNames.ROLE_PERMISSIONS).insert(inserts)
      }
    })
  }

  async setUserRole(data: {
    userId: string
    clinicId: string
    roleId: string
  }): Promise<void> {
    const role = await this.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    })
    if (!role) {
      throw new ApiError('Papel não encontrado nesta clínica.', 404, 'role')
    }

    const updated = await this.knex(ETableNames.USERS)
      .update({ roleId: data.roleId })
      .where({ id: data.userId, clinicId: data.clinicId })
    if (updated === 0) {
      throw new ApiError('Usuário não encontrado', 404, 'user')
    }
  }

  async createClinicAdminRole(clinicId: string): Promise<string> {
    const existing = await this.knex(ETableNames.ROLES)
      .first<{ id: string }>('id')
      .where({ clinicId, isSystem: true })
    if (existing) return existing.id

    const permIds = (await this.knex(ETableNames.PERMISSIONS).select('id')) as {
      id: string
    }[]
    if (permIds.length === 0) {
      throw new ApiError(
        'Catálogo de permissões não encontrado. Execute as migrações do RBAC.',
        500,
        'permissions',
      )
    }

    const roleId = randomUUID()
    await this.knex(ETableNames.ROLES).insert({
      id: roleId,
      clinicId,
      name: RBAC_DEFAULT_ADMIN_ROLE_NAME,
      description: 'Acesso total (papel de sistema)',
      isSystem: true,
    })
    const rpRows = permIds.map((perm) => ({
      id: randomUUID(),
      roleId,
      permissionId: perm.id,
      scope: null,
    }))
    await this.knex(ETableNames.ROLE_PERMISSIONS).insert(rpRows)
    return roleId
  }
}
