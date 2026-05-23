import { SYSTEM_PERMISSIONS } from '../../../database/seeds/permissions.seed'
import { z } from '../../../schemas/zodOpenApi'

const permissionKeyEnumValues = SYSTEM_PERMISSIONS.map((p) => p.key) as [
  string,
  ...string[],
]

export const PermissionKeySchema = z.enum(permissionKeyEnumValues).openapi('RbacPermissionKey')

export const ReplaceRolePermissionsBodySchema = z
  .array(
    z
      .object({
        permissionKey: PermissionKeySchema,
        scope: z.unknown().optional().nullable(),
      })
      .openapi('RbacReplaceRolePermissionItem'),
  )
  .openapi('RbacReplaceRolePermissionsBody')

export const PatchUserRoleBodySchema = z
  .object({
    roleId: z.string().min(1),
  })
  .openapi('RbacPatchUserRoleBody')

export const CreateRoleBodySchema = z
  .object({
    name: z.string().min(1).max(80),
    description: z.string().max(200).optional(),
  })
  .openapi('RbacCreateRoleBody')

export const UpdateRoleBodySchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    description: z.string().max(200).optional(),
  })
  .openapi('RbacUpdateRoleBody')

export const RoleIdParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('RbacRoleIdParams')

export const UserIdParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('RbacUserIdParams')

const permissionActionSchema = z.enum(['read', 'write'])

export const RoleRowResponseSchema = z
  .object({
    id: z.string(),
    clinicId: z.string(),
    name: z.string(),
    description: z.string(),
    isSystem: z.boolean(),
  })
  .openapi('RbacRoleRow')

export const ListRolesResponseSchema = z.array(RoleRowResponseSchema).openapi('RbacListRolesResponse')

export const PermissionCatalogRowSchema = z
  .object({
    id: z.string(),
    key: PermissionKeySchema,
    module: z.string(),
    action: permissionActionSchema,
    description: z.string(),
  })
  .openapi('RbacPermissionCatalogRow')

export const ListPermissionCatalogResponseSchema = z
  .array(PermissionCatalogRowSchema)
  .openapi('RbacListPermissionCatalogResponse')

export const RolePermissionEntryResponseSchema = z
  .object({
    permissionKey: PermissionKeySchema,
    scope: z.unknown().nullable().optional(),
  })
  .openapi('RbacRolePermissionEntry')

export const ListRolePermissionsResponseSchema = z
  .array(RolePermissionEntryResponseSchema)
  .openapi('RbacListRolePermissionsResponse')
