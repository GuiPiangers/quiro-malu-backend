import type { PermissionKey } from '../../database/seeds/permissions.seed'
import type { Role, RolePermissionDTO } from '../../core/rbac/models/Role'
import type { ResolvedPermission } from '../../types/permissions'

export type PermissionCatalogRow = {
  id: string
  key: PermissionKey
  module: string
  action: string
  description: string
}

export type RoleRow = {
  id: string
  clinicId: string
  name: string
  description: string
  isSystem: boolean
}

export type RolePermissionItem = RolePermissionDTO

export interface IRbacRepository {
  findResolvedPermissionsByUser(data: {
    userId: string
    clinicId: string
  }): Promise<ResolvedPermission[]>

  findAllPermissionsCatalog(): Promise<PermissionCatalogRow[]>

  listRolesByClinic(clinicId: string): Promise<Role[]>

  createRole(role: Role): Promise<Role>

  updateRole(data: {
    id: string
    clinicId: string
    name?: string
    description?: string
  }): Promise<void>

  deleteRole(data: { id: string; clinicId: string }): Promise<void>

  findRoleByIdForClinic(data: {
    id: string
    clinicId: string
  }): Promise<Role | null>

  listRolePermissions(data: {
    roleId: string
    clinicId: string
  }): Promise<RolePermissionItem[]>

  replaceRolePermissions(data: {
    roleId: string
    clinicId: string
    items: RolePermissionItem[]
  }): Promise<void>

  setUserRole(data: {
    userId: string
    clinicId: string
    roleId: string
  }): Promise<void>
}
