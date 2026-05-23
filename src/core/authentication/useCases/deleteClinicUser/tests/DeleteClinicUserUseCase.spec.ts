import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { ApiError } from '../../../../../utils/ApiError'
import { DeleteClinicUserUseCase } from '../DeleteClinicUserUseCase'

describe('DeleteClinicUserUseCase', () => {
  const userRepository = createMockUserRepository()
  let useCase: DeleteClinicUserUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new DeleteClinicUserUseCase(userRepository)
  })

  it('remove usuário da clínica do token', async () => {
    userRepository.deleteByIdForClinic.mockResolvedValue(1)

    await useCase.execute({
      actingUserId: 'actor',
      clinicId: 'clinic-1',
      targetUserId: 'target',
    })

    expect(userRepository.deleteByIdForClinic).toHaveBeenCalledWith({
      id: 'target',
      clinicId: 'clinic-1',
    })
  })

  it('rejeita remoção do próprio usuário', async () => {
    await expect(
      useCase.execute({
        actingUserId: 'same',
        clinicId: 'clinic-1',
        targetUserId: 'same',
      }),
    ).rejects.toThrow(ApiError)
    expect(userRepository.deleteByIdForClinic).not.toHaveBeenCalled()
  })

  it('404 quando delete não afeta linha (outra clínica ou inexistente)', async () => {
    userRepository.deleteByIdForClinic.mockResolvedValue(0)

    await expect(
      useCase.execute({
        actingUserId: 'actor',
        clinicId: 'clinic-1',
        targetUserId: 'missing',
      }),
    ).rejects.toThrow(ApiError)
  })
})
