import { createMockClinicRepository } from '../../../../../repositories/_mocks/ClinicRepositoryMock'
import { createMockRbacRepository } from '../../../../../repositories/_mocks/RbacRepositoryMock'
import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { ApiError } from '../../../../../utils/ApiError'
import { CreateClinicUseCase } from '../CreateClinicUseCase'

describe('CreateClinicUseCase', () => {
  const clinicRepository = createMockClinicRepository()
  const rbacRepository = createMockRbacRepository()
  const userRepository = createMockUserRepository()
  let createClinicUseCase: CreateClinicUseCase

  const validPayload = {
    name: 'Clínica Teste',
    owner: {
      name: 'Proprietário Teste',
      email: 'owner@teste.com',
      phone: '(51) 99999 9999',
      password: 'SenhaForte123!',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    rbacRepository.findAllPermissionsCatalog.mockResolvedValue([
      {
        id: 'permission-id',
        key: 'users:write',
        module: 'users',
        action: 'write',
        description: 'Gerenciar usuários, papéis e permissões',
      },
    ])
    createClinicUseCase = new CreateClinicUseCase(
      clinicRepository,
      rbacRepository,
      userRepository,
    )
  })

  it('should create clinic and owner user', async () => {
    clinicRepository.findByName.mockResolvedValue(null)
    userRepository.getByEmail.mockResolvedValue([])

    const clinic = await createClinicUseCase.execute(validPayload)

    expect(clinic).toHaveProperty('id')
    expect(clinicRepository.save).toHaveBeenCalledTimes(1)
    expect(rbacRepository.createRole).toHaveBeenCalledTimes(1)
    expect(userRepository.save).toHaveBeenCalledTimes(1)
  })

  it('should reject duplicated clinic name', async () => {
    clinicRepository.findByName.mockResolvedValue({
      id: 'clinic-id',
      name: 'Clínica Teste',
      getDTO: () => ({ id: 'clinic-id', name: 'Clínica Teste' }),
    } as any)

    await expect(
      createClinicUseCase.execute(validPayload),
    ).rejects.toThrow(new ApiError('Clínica já cadastrada', 400, 'clinic'))
  })

  it('should reject duplicated owner email', async () => {
    clinicRepository.findByName.mockResolvedValue(null)
    userRepository.getByEmail.mockResolvedValue([
      {
        id: 'existing-user-id',
        email: 'owner@teste.com',
      } as any,
    ])

    await expect(
      createClinicUseCase.execute(validPayload),
    ).rejects.toThrow(new ApiError('Usuário já cadastrado', 400, 'email'))
  })
})
