import type { PermissionKey } from '../database/seeds/permissions.seed'

export type PermissionScope =
  | { type: 'all' }
  | { type: 'own' }
  | { type: 'list'; userIds: string[] }

export interface ResolvedPermission {
  key: PermissionKey;
  scope: PermissionScope | null;
}
