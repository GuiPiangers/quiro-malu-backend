import { describe, it, beforeEach, expect, vi } from 'vitest'
import { CreateDefaultRolesUseCase } from '../createDefaultRoles'
import { IRbacRepository } from '../../../../../repositories/rbac/IRbacRepository'
import { createMockRbacRepository } from '../../../../../repositories/_mocks/RbacRepositoryMock'
import { Role } from '../../../models/Role'

describe('CreateDefaultRolesUseCase', () => {
  let createDefaultRolesUseCase: CreateDefaultRolesUseCase
  let rbacRepository: IRbacRepository

  beforeEach(() => {
    rbacRepository = createMockRbacRepository()
    createDefaultRolesUseCase = new CreateDefaultRolesUseCase(rbacRepository)
  })

  it('should create default roles (Clinico, Recepcionista, Financeiro)', async () => {
    const data = { clinicId: 'clinic-1' }
    await createDefaultRolesUseCase.execute(data)

    expect(rbacRepository.createRole).toHaveBeenCalledTimes(3)
    
    const calls = vi.mocked(rbacRepository.createRole).mock.calls
    calls.forEach((call) => {
      expect(call[0]).toBeInstanceOf(Role)
    })

    const clinicianRole = calls.find((call) => call[0].name === 'Clinico')![0] as Role
    expect(clinicianRole.clinicId).toBe('clinic-1')
    expect(clinicianRole.isSystem).toBe(true)
    expect(clinicianRole.getPermissionsDTO()).toEqual(
      expect.arrayContaining([
        { permissionKey: 'patients:read', scope: { type: 'all' } },
        { permissionKey: 'patients:write', scope: { type: 'all' } },
        { permissionKey: 'patients_clinical_data:read', scope: { type: 'all' } },
        { permissionKey: 'patients_clinical_data:write', scope: { type: 'all' } },
        { permissionKey: 'events:read', scope: { type: 'own' } },
        { permissionKey: 'events:write', scope: { type: 'own' } },
        { permissionKey: 'services:read', scope: { type: 'own' } },
        { permissionKey: 'services:write', scope: { type: 'own' } },
      ])
    )
    expect(clinicianRole.getPermissionsDTO()).toHaveLength(8)

    const attendantRole = calls.find((call) => call[0].name === 'Recepcionista')![0] as Role
    expect(attendantRole.clinicId).toBe('clinic-1')
    expect(attendantRole.isSystem).toBe(true)
    expect(attendantRole.getPermissionsDTO()).toEqual(
      expect.arrayContaining([
        { permissionKey: 'patients:read', scope: { type: 'all' } },
        { permissionKey: 'patients:write', scope: { type: 'all' } },
        { permissionKey: 'events:read', scope: { type: 'all' } },
        { permissionKey: 'events:write', scope: { type: 'all' } },
        { permissionKey: 'services:read', scope: { type: 'all' } },
      ])
    )
    expect(attendantRole.getPermissionsDTO()).toHaveLength(5)

    const financialRole = calls.find((call) => call[0].name === 'Financeiro')![0] as Role
    expect(financialRole.clinicId).toBe('clinic-1')
    expect(financialRole.isSystem).toBe(true)
    expect(financialRole.getPermissionsDTO()).toEqual(
      expect.arrayContaining([
        { permissionKey: 'finance:read', scope: { type: 'all' } },
        { permissionKey: 'finance:write', scope: { type: 'all' } },
      ])
    )
    expect(financialRole.getPermissionsDTO()).toHaveLength(2)
  })
})
