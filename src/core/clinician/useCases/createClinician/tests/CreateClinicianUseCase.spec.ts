import { createMockClinicianRepository } from '../../../../../repositories/_mocks/ClinicianRepositoryMock'
import { createMockClinicRepository } from '../../../../../repositories/_mocks/ClinicRepositoryMock'
import { createMockServiceRepository } from '../../../../../repositories/_mocks/ServiceRepositoryMock'
import { createMockUserRepository } from '../../../../../repositories/_mocks/UserRepositoryMock'
import { CreateClinicianUseCase } from '../CreateClinicianUseCase'

describe('CreateClinicianUseCase', () => {
  const clinicId = '00000000-0000-4000-8000-000000000001'
  const roleId = 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee'
  const serviceId = 'bbbbbbbb-bbbb-4ccc-dddd-eeeeeeeeeeee'

  const clinicRepository = createMockClinicRepository()
  const rbacRepository = {
    findRoleByIdForClinic: vi.fn(),
  }
  const clinicianRepository = createMockClinicianRepository()
  const serviceRepository = createMockServiceRepository()
  const userRepository = createMockUserRepository()
  let useCase: CreateClinicianUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    userRepository.getByEmail.mockResolvedValue([])
    clinicRepository.findById.mockResolvedValue({
      id: clinicId,
      name: 'Clínica Teste',
      getDTO: () => ({ id: clinicId, name: 'Clínica Teste' }),
    } as any)
    rbacRepository.findRoleByIdForClinic.mockResolvedValue({
      id: roleId,
      clinicId,
      name: 'Papel teste',
      description: '',
    })
    serviceRepository.get.mockResolvedValue({
      id: serviceId,
      name: 'Sessão',
      value: 100,
      duration: 60,
    })
    clinicianRepository.save.mockResolvedValue(undefined)

    useCase = new CreateClinicianUseCase(
      clinicianRepository,
      userRepository,
      clinicRepository,
      rbacRepository as any,
      serviceRepository,
    )
  })

  it('creates clinician and persists via repository', async () => {
    const result = await useCase.execute(
      {
        name: 'Dr. Clínico',
        email: 'clinico@teste.com',
        phone: '(51) 99999 9999',
        password: 'Senha123',
        roleId,
        services: [{ serviceId }],
      },
      clinicId,
    )

    expect(result.email).toBe('clinico@teste.com')
    expect(result.clinicId).toBe(clinicId)
    expect(result.services).toHaveLength(1)
    expect(result.services[0].id).toBe(serviceId)
    expect(result.services[0].name).toBe('Sessão')
    expect(clinicianRepository.save).toHaveBeenCalledTimes(1)
    expect(serviceRepository.get).toHaveBeenCalledWith({
      id: serviceId,
      clinicId,
    })
  })

  it('rejects duplicate email', async () => {
    userRepository.getByEmail
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'existing-id',
          email: 'dup@teste.com',
          password: '$2b$10$abcdefghijklmnopqrstuv',
          name: 'Existing',
          phone: '(51) 99999 9999',
          clinicId,
          roleId,
        },
      ])

    await useCase.execute(
      {
        name: 'Primeiro User',
        email: 'dup@teste.com',
        phone: '(51) 99999 9999',
        password: 'Senha123',
        roleId,
        services: [],
      },
      clinicId,
    )

    await expect(
      useCase.execute(
        {
          name: 'Segundo User',
          email: 'dup@teste.com',
          phone: '(51) 98888 8888',
          password: 'Senha123',
          roleId,
          services: [],
        },
        clinicId,
      ),
    ).rejects.toThrow('Usuário já cadastrado')
    expect(clinicianRepository.save).toHaveBeenCalledTimes(1)
  })

  it('rejects unknown service in clinic', async () => {
    serviceRepository.get.mockResolvedValue(null)

    await expect(
      useCase.execute(
        {
          name: 'Dr. X',
          email: 'x@teste.com',
          phone: '(51) 99999 9999',
          password: 'Senha123',
          roleId,
          services: [{ serviceId }],
        },
        clinicId,
      ),
    ).rejects.toThrow('Serviço não encontrado na clínica')
    expect(clinicianRepository.save).not.toHaveBeenCalled()
  })

  it('rejects invalid role', async () => {
    rbacRepository.findRoleByIdForClinic.mockResolvedValue(null)

    await expect(
      useCase.execute(
        {
          name: 'Dr. Y',
          email: 'y@teste.com',
          phone: '(51) 99999 9999',
          password: 'Senha123',
          roleId,
          services: [],
        },
        clinicId,
      ),
    ).rejects.toThrow('Papel inválido')
  })
})

export {}
