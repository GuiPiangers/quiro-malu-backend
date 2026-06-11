import type { Mocked } from 'vitest'
import type { IRbacRepository } from '../rbac/IRbacRepository'
import { vi } from 'vitest'

export const createMockRbacRepository = (): Mocked<IRbacRepository> => ({
  findResolvedPermissionsByUser: vi.fn(),
  findAllPermissionsCatalog: vi.fn(),
  listRolesByClinic: vi.fn(),
  createRole: vi.fn(),
  updateRole: vi.fn(),
  deleteRole: vi.fn(),
  findRoleByIdForClinic: vi.fn(),
  listRolePermissions: vi.fn(),
  replaceRolePermissions: vi.fn(),
  setUserRole: vi.fn(),
})
