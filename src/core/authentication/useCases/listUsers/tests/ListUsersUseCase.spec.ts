import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { ListUsersUseCase } from '../ListUsersUseCase'

describe('ListUsersUseCase', () => {
  const clinicId = '00000000-0000-4000-8000-000000000001'
  const userRepository = createMockUserRepository()
  let useCase: ListUsersUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new ListUsersUseCase(userRepository)
  })

  it('returns users from repository', async () => {
    const users = [
      {
        id: 'u1',
        name: 'A',
        email: 'a@test.com',
        phone: '(51) 99999 9999',
        clinicId,
        roleId: null,
      },
    ]
    userRepository.listByClinicId.mockResolvedValue(users)

    const result = await useCase.execute(clinicId)

    expect(result).toEqual(users)
    expect(userRepository.listByClinicId).toHaveBeenCalledWith({ clinicId })
  })
})

export {}
