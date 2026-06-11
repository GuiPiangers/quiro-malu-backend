import type { PermissionKey } from '../../../database/seeds/permissions.seed'
import { ApiError } from '../../../utils/ApiError'
import type { PermissionScope } from '../../../types/permissions'
import { Entity } from '../../shared/Entity'
import { RBAC_DEFAULT_ADMIN_ROLE_NAME } from '../constants'

export type RolePermissionDTO = {
  permissionKey: PermissionKey
  scope: PermissionScope | unknown | null
}

export type RoleDTO = {
  id?: string
  clinicId: string
  name: string
  description?: string
  isSystem?: boolean
  permissions?: RolePermissionDTO[]
}

export class RolePermission {
  readonly permissionKey: PermissionKey
  readonly scope: PermissionScope | unknown | null

  constructor({ permissionKey, scope }: RolePermissionDTO) {
    this.permissionKey = permissionKey
    this.scope = scope ?? null
  }

  getDTO(): RolePermissionDTO {
    return {
      permissionKey: this.permissionKey,
      scope: this.scope,
    }
  }
}

export class Role extends Entity {
  readonly clinicId: string
  readonly name: string
  readonly description: string
  readonly isSystem: boolean
  private readonly permissions: RolePermission[]

  constructor({
    id,
    clinicId,
    name,
    description,
    isSystem = false,
    permissions = [],
  }: RoleDTO) {
    super(id)
    this.clinicId = clinicId
    this.name = name.trim()
    this.description = (description ?? '').trim()
    this.isSystem = isSystem
    this.permissions = permissions.map((permission) => {
      return new RolePermission(permission)
    })
    this.ensureUniquePermissions()
  }

  static createClinicAdmin(data: {
    clinicId: string
    permissions: PermissionKey[]
  }): Role {
    if (data.permissions.length === 0) {
      throw new ApiError(
        'Catálogo de permissões não encontrado. Execute as migrações do RBAC.',
        500,
        'permissions',
      )
    }

    return new Role({
      clinicId: data.clinicId,
      name: RBAC_DEFAULT_ADMIN_ROLE_NAME,
      description: 'Acesso total (papel de sistema)',
      isSystem: true,
      permissions: data.permissions.map((permissionKey) => ({
        permissionKey,
        scope: { type: 'all' },
      })),
    })
  }

  assertCanBeChanged(): void {
    if (!this.isSystem) return

    throw new ApiError(
      'Não é permitido alterar um papel de sistema',
      400,
      'role',
    )
  }

  assertCanBeDeleted(): void {
    if (!this.isSystem) return

    throw new ApiError(
      'Não é permitido excluir um papel de sistema',
      400,
      'role',
    )
  }

  assertPermissionsCanBeChanged(): void {
    if (!this.isSystem) return

    throw new ApiError(
      'Não é permitido alterar permissões de um papel de sistema',
      400,
      'role',
    )
  }

  replacePermissions(permissions: RolePermissionDTO[]): Role {
    this.assertPermissionsCanBeChanged()

    return new Role({
      ...this.getDTO(),
      permissions,
    })
  }

  addPermission(permission: RolePermissionDTO): Role {
    return this.replacePermissions([...this.getPermissionsDTO(), permission])
  }

  getPermissionsDTO(): RolePermissionDTO[] {
    return this.permissions.map((permission) => permission.getDTO())
  }

  getDTO(): RoleDTO {
    return {
      id: this.id,
      clinicId: this.clinicId,
      name: this.name,
      description: this.description,
      isSystem: this.isSystem,
      permissions: this.getPermissionsDTO(),
    }
  }

  private ensureUniquePermissions(): void {
    const permissionKeys = this.permissions.map((permission) => {
      return permission.permissionKey
    })

    if (new Set(permissionKeys).size === permissionKeys.length) return

    throw new ApiError(
      'Permissões duplicadas no corpo da requisição.',
      400,
      'permission',
    )
  }
}
