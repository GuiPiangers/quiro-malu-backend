import { createMockClinicianRepository } from '../../../../repositories/_mocks/ClinicianRepositoryMock'
import { createMockRbacRepository } from '../../../../repositories/_mocks/RbacRepositoryMock'
import type { Clinician } from '../../../clinician/models/Clinician'
import { ApiError } from '../../../../utils/ApiError'
import { ReplaceRolePermissionsUseCase } from './ReplaceRolePermissionsUseCase'

describe('ReplaceRolePermissionsUseCase', () => {
  const rbac = createMockRbacRepository()
  const clinicianRepository = createMockClinicianRepository()
  let useCase: ReplaceRolePermissionsUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new ReplaceRolePermissionsUseCase(rbac, clinicianRepository)
    rbac.findRoleByIdForClinic.mockResolvedValue({
      id: 'role-1',
      clinicId: 'clinic-1',
      name: 'Recepção',
      description: '',
      isSystem: false,
    })
    clinicianRepository.findById.mockResolvedValue({} as Clinician)
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue(['clinician-1'])
  })

  it('rejects invalid scope shape', async () => {
    await expect(
      useCase.execute({
        roleId: 'role-1',
        clinicId: 'clinic-1',
        items: [
          {
            permissionKey: 'events:read',
            scope: { type: 'invalid' },
          },
        ],
      }),
    ).rejects.toMatchObject({
      message: 'Escopo de permissão inválido',
      statusCode: 400,
    })

    expect(rbac.replaceRolePermissions).not.toHaveBeenCalled()
  })

  it('validates list userIds as clinicians of the clinic', async () => {
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValueOnce([])

    await expect(
      useCase.execute({
        roleId: 'role-1',
        clinicId: 'clinic-1',
        items: [
          {
            permissionKey: 'events:write',
            scope: { type: 'list', userIds: ['not-a-clinician'] },
          },
        ],
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      type: 'scope',
    })
  })

  it('persists normalized scope for events permissions', async () => {
    await useCase.execute({
      roleId: 'role-1',
      clinicId: 'clinic-1',
      items: [
        {
          permissionKey: 'events:read',
          scope: { type: 'own' },
        },
        {
          permissionKey: 'events:write',
          scope: { type: 'list', userIds: ['clinician-1'] },
        },
      ],
    })

    expect(clinicianRepository.findClinicianIdsInClinic).toHaveBeenCalledWith({
      clinicId: 'clinic-1',
      userIds: ['clinician-1'],
    })
    expect(rbac.replaceRolePermissions).toHaveBeenCalledWith({
      roleId: 'role-1',
      clinicId: 'clinic-1',
      items: [
        {
          permissionKey: 'events:read',
          scope: { type: 'own' },
        },
        {
          permissionKey: 'events:write',
          scope: { type: 'list', userIds: ['clinician-1'] },
        },
      ],
    })
  })

  it('blocks changes to system roles', async () => {
    rbac.findRoleByIdForClinic.mockResolvedValue({
      id: 'role-admin',
      clinicId: 'clinic-1',
      name: 'Administrador',
      description: '',
      isSystem: true,
    })

    await expect(
      useCase.execute({
        roleId: 'role-admin',
        clinicId: 'clinic-1',
        items: [{ permissionKey: 'events:read', scope: { type: 'all' } }],
      }),
    ).rejects.toThrow(ApiError)
  })
})
