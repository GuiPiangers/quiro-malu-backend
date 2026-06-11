import { UserDTO } from '../../../models/User'
import { IUserRepository } from '../../../../../repositories/user/IUserRepository'
import { InMemoryUserRepository } from '../../../../../repositories/user/inMemory/InMemoryUserRepository'
import { createMockClinicRepository } from '../../../../../repositories/_mocks/ClinicRepositoryMock'
import { Role } from '../../../../rbac/models/Role'
import { CreateUserUseCase } from '../CreateUserUseCase'

describe('Create user', () => {
  let userRepository: IUserRepository
  let createUserUseCase: CreateUserUseCase
  const clinicId = '00000000-0000-4000-8000-000000000001'
  const roleId = 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee'
  const clinicRepository = createMockClinicRepository()
  const rbacRepository = {
    findRoleByIdForClinic: vi.fn().mockResolvedValue(new Role({
      id: roleId,
      clinicId,
      name: 'Papel teste',
      description: '',
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    userRepository = new InMemoryUserRepository()
    clinicRepository.findById.mockResolvedValue({
      id: clinicId,
      name: 'Clínica Teste',
      getDTO: () => ({ id: clinicId, name: 'Clínica Teste' }),
    } as any)
    rbacRepository.findRoleByIdForClinic.mockResolvedValue(new Role({
      id: roleId,
      clinicId,
      name: 'Papel teste',
      description: '',
    }))
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      clinicRepository,
      rbacRepository as any,
    )
  })

  it('Should be able to create user', async () => {
    const userData: UserDTO = {
      email: 'guilherme@gmail.com',
      password: 'Senha123',
      name: 'Guilherme Eduardo',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    const user = await createUserUseCase.execute(userData)
    expect(user).toHaveProperty('id')
  })

  it('The name should not have less than 3 caracteres', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Senha123',
      name: 'nm',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'Deve ser informado no mínimo 3 caracteres',
    )
  })
  it('The name should not have more than 120 caracteres', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Senha123',
      name: 'nmqwertyuiopasdfghjklçzxcvbnmqwertyuiopasdfghjklzxcvbnm asdqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjkl asdqwertyuioqwrtypdsad asd',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'Deve ser informado no máximo 120 caracteres',
    )
  })
  it('The email should not be invalid', async () => {
    const user: UserDTO = {
      email: 'existingUser',
      password: 'Senha123',
      name: 'Guilherme Piangers',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'email inválido',
    )
  })
  it('The email should not be invalid', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail',
      password: 'Senha123',
      name: 'Guilherme Piangers',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'email inválido',
    )
  })
  it('The phone should not be different than pattern', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Senha123',
      name: 'Guilherme Piangers',
      phone: '51 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'Número de telefone fora do padrão esperado',
    )
  })
  it('The password should not contain only letters', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Senha',
      name: 'Guilherme Piangers',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'A senha deve conter pelo menos um número ou carácter especial',
    )
  })
  it('The password should not be short than 5 caracteres', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Sen1',
      name: 'Guilherme Piangers',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'A senha deve conter pelo menos 5 caracteres',
    )
  })
  it('The password should not contain only lowercase letters', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'senha123',
      name: 'Guilherme Piangers',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'A senha deve conter pelo menos uma letra maiúscula',
    )
  })
  it('Should not be able to create an existing user', async () => {
    const user: UserDTO = {
      email: 'existingUser@gmail.com',
      password: 'Senha123',
      name: 'Existing User Name',
      phone: '(51) 99999 9999',
      clinicId,
      roleId,
    }

    await createUserUseCase.execute(user)
    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      'Usuário já cadastrado',
    )
  })
  it('Should not create user without an existing clinic', async () => {
    clinicRepository.findById.mockResolvedValue(null)

    await expect(
      createUserUseCase.execute({
        email: 'clinicMissing@gmail.com',
        password: 'Senha123',
        name: 'Clinic Missing',
        phone: '(51) 99999 9999',
        clinicId,
        roleId,
      }),
    ).rejects.toThrow('Clínica não encontrada')
  })

  it('Should reject invalid role for clinic', async () => {
    rbacRepository.findRoleByIdForClinic.mockResolvedValue(null)

    await expect(
      createUserUseCase.execute({
        email: 'role@gmail.com',
        password: 'Senha123',
        name: 'Role Invalid',
        phone: '(51) 99999 9999',
        clinicId,
        roleId,
      }),
    ).rejects.toThrow('Papel inválido')
  })
})

export {}
