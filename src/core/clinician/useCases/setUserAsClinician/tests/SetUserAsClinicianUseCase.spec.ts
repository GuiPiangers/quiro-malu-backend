import { createMockClinicianRepository } from '../../../../../repositories/_mocks/ClinicianRepositoryMock'
import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { ApiError } from '../../../../../utils/ApiError'
import { SetUserAsClinicianUseCase } from '../SetUserAsClinicianUseCase'

describe('SetUserAsClinicianUseCase', () => {
  const clinicianRepository = createMockClinicianRepository()
  const userRepository = createMockUserRepository()
  let useCase: SetUserAsClinicianUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new SetUserAsClinicianUseCase(clinicianRepository, userRepository)
  })

  it('should set user as clinician', async () => {
    userRepository.getById.mockResolvedValue([{ id: 'user-id', clinicId: 'clinic-id' } as any])
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue([])

    await useCase.execute({ userId: 'user-id' }, 'clinic-id')

    expect(clinicianRepository.setAsClinician).toHaveBeenCalledWith('user-id')
  })

  it('should reject if user is not found in clinic', async () => {
    userRepository.getById.mockResolvedValue([])

    await expect(useCase.execute({ userId: 'user-id' }, 'clinic-id')).rejects.toThrow(
      new ApiError('Usuário não encontrado nesta clínica', 404, 'userId'),
    )
  })

  it('should reject if user is already a clinician', async () => {
    userRepository.getById.mockResolvedValue([{ id: 'user-id', clinicId: 'clinic-id' } as any])
    clinicianRepository.findClinicianIdsInClinic.mockResolvedValue(['user-id'])

    await expect(useCase.execute({ userId: 'user-id' }, 'clinic-id')).rejects.toThrow(
      new ApiError('Usuário já é um profissional clínico'),
    )
  })
})
