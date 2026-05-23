import type { PermissionScope } from '../types/permissions'

export function parsePermissionScope(raw: unknown): PermissionScope | null {
  if (raw == null) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as PermissionScope
    } catch {
      return { type: 'all' }
    }
  }
  if (typeof raw === 'object' && raw !== null && 'type' in raw) {
    return raw as PermissionScope
  }
  return null
}

export function mergeScopesForSamePermission(scopes: unknown[]): PermissionScope | null {
  const normalized = scopes.map((s) => {
    const parsed = parsePermissionScope(s)
    return parsed ?? ({ type: 'all' } as const)
  })
  if (normalized.some((s) => s.type === 'all')) return { type: 'all' }
  const lists = normalized.filter(
    (s): s is { type: 'list'; userIds: string[] } => s.type === 'list',
  )
  if (lists.length) {
    const userIds = [...new Set(lists.flatMap((l) => l.userIds))]
    return { type: 'list', userIds }
  }
  if (normalized.some((s) => s.type === 'own')) return { type: 'own' }
  return { type: 'all' }
}
