import { z } from '../../../schemas/zodOpenApi'

export const PermissionScopeSchema = z
  .discriminatedUnion('type', [
    z.object({ type: z.literal('all') }).openapi('PermissionScopeAll'),
    z.object({ type: z.literal('own') }).openapi('PermissionScopeOwn'),
    z
      .object({
        type: z.literal('list'),
        userIds: z.array(z.string().min(1)).min(1),
      })
      .openapi('PermissionScopeList'),
  ])
  .openapi('PermissionScope')

export const PermissionScopeInputSchema = z
  .union([PermissionScopeSchema, z.null()])
  .openapi('PermissionScopeInput')
