import type { PermissionScope } from '../types/permissions'
import { ApiError } from './ApiError'

export type EventsScopeAuthorization = {
  requestUserId: string
  eventsScope?: PermissionScope | null
}

export function normalizePermissionScope(
  scope: PermissionScope | null | undefined,
): PermissionScope {
  return scope ?? { type: 'all' }
}

export function isUserIdAllowedInEventsScope(data: {
  requestUserId: string
  targetUserId: string
  scope: PermissionScope | null | undefined
}): boolean {
  const scope = normalizePermissionScope(data.scope)

  if (scope.type === 'all') return true
  if (scope.type === 'own') return data.targetUserId === data.requestUserId
  return scope.userIds.includes(data.targetUserId)
}

export function assertUserIdAllowedInEventsScope(data: {
  requestUserId: string
  targetUserId: string
  scope: PermissionScope | null | undefined
}): void {
  if (!isUserIdAllowedInEventsScope(data)) {
    throw new ApiError('Acesso negado.', 403, 'forbidden')
  }
}

export function assertEventsScopeAccess(
  targetUserId: string,
  auth: EventsScopeAuthorization,
): void {
  assertUserIdAllowedInEventsScope({
    requestUserId: auth.requestUserId,
    targetUserId,
    scope: auth.eventsScope,
  })
}
