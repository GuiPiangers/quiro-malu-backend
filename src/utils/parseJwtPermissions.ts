import type { PermissionKey } from "../database/seeds/permissions.seed";
import type { PermissionScope, ResolvedPermission } from "../types/permissions";

function isPermissionScope(value: unknown): value is PermissionScope {
  if (!value || typeof value !== "object") return false;
  const type = (value as { type?: unknown }).type;
  return type === "all" || type === "own" || type === "list";
}

function isResolvedPermission(value: unknown): value is ResolvedPermission {
  if (!value || typeof value !== "object") return false;
  const row = value as { key?: unknown; scope?: unknown };
  return typeof row.key === "string" && row.key.length > 0;
}

/** Extrai permissões do payload JWT quando presentes e bem formadas. */
export function parseJwtPermissions(
  value: unknown,
): ResolvedPermission[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const permissions: ResolvedPermission[] = [];
  for (const item of value) {
    if (!isResolvedPermission(item)) return null;
    permissions.push({
      key: item.key as PermissionKey,
      scope: isPermissionScope(item.scope) ? item.scope : null,
    });
  }
  return permissions;
}
