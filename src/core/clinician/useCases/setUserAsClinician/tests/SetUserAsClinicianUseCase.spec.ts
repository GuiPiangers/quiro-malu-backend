import { createMockClinicianRepository } from '../../../../../repositories/_mocks/ClinicianRepositoryMock'
import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { createMockRbacRepository } from '../../../../../repositories/_mocks/RbacRepositoryMock'
import { ApiError } from '../../../../../utils/ApiError'
import { SetUserAsClinicianUseCase } from '../SetUserAsClinicianUseCase'

describe('SetUserAsClinicianUseCase', () => {
  const clinicianRepository = createMockClinicianRepository()
  const userRepository = createMockUserRepository()
  const rbacRepository = createMockRbacRepository()
  let useCase: SetUserAsClinicianUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new SetUserAsClinicianUseCase(
      clinicianRepository,
      userRepository,
      rbacRepository,
    )
  })

  it('should set user as clinician and grant minimum permissions', async () => {
    userRepository.getById.mockResolvedValue({
      id: 'user-id',
      clinicId: 'clinic-id',
    } as any)
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue([])
    rbacRepository.setUserPermissions.mockResolvedValue(undefined)

    await useCase.execute({ userId: 'user-id' }, 'clinic-id')

    expect(clinicianRepository.setAsClinician).toHaveBeenCalledWith('user-id')
    expect(rbacRepository.setUserPermissions).toHaveBeenCalledWith({
      userId: 'user-id',
      items: expect.arrayContaining([
        expect.objectContaining({ permissionKey: 'events:read' }),
        expect.objectContaining({ permissionKey: 'events:write' }),
        expect.objectContaining({ permissionKey: 'patients:read' }),
        expect.objectContaining({ permissionKey: 'patients:write' }),
        expect.objectContaining({
          permissionKey: 'patients_clinical_data:read',
        }),
        expect.objectContaining({
          permissionKey: 'patients_clinical_data:write',
        }),
      ]),
    })
  })

  it('should set events permissions with scope own', async () => {
    userRepository.getById.mockResolvedValue({
      id: 'user-id',
      clinicId: 'clinic-id',
    } as any)
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue([])
    rbacRepository.setUserPermissions.mockResolvedValue(undefined)

    await useCase.execute({ userId: 'user-id' }, 'clinic-id')

    const call = rbacRepository.setUserPermissions.mock.calls[0]![0]
    const eventsRead = call.items.find((i) => i.permissionKey === 'events:read')
    const eventsWrite = call.items.find((i) => i.permissionKey === 'events:write')

    expect(eventsRead?.scope).toEqual({ type: 'own' })
    expect(eventsWrite?.scope).toEqual({ type: 'own' })
  })

  it('should reject if user is not found in clinic', async () => {
    userRepository.getById.mockResolvedValue(null)

    await expect(
      useCase.execute({ userId: 'user-id' }, 'clinic-id'),
    ).rejects.toThrow(
      new ApiError('Usuário não encontrado nesta clínica', 404, 'userId'),
    )

    expect(rbacRepository.setUserPermissions).not.toHaveBeenCalled()
  })

  it('should reject if user is already a clinician', async () => {
    userRepository.getById.mockResolvedValue({
      id: 'user-id',
      clinicId: 'clinic-id',
    } as any)
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue(['user-id'])

    await expect(
      useCase.execute({ userId: 'user-id' }, 'clinic-id'),
    ).rejects.toThrow(new ApiError('Usuário já é um profissional clínico'))

    expect(rbacRepository.setUserPermissions).not.toHaveBeenCalled()
  })
})
