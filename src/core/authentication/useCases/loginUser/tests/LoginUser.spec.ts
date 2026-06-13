import { User, UserDTO } from '../../../models/User'
import { IGenerateTokenProvider } from '../../../../../repositories/token/IGenerateTokenProvider'
import { IRefreshTokenProvider } from '../../../../../repositories/token/IRefreshTokenProvider'
import { InMemoryGenerateToken } from '../../../../../repositories/token/inMemory/InMemoryGenerateToken'
import { InMemoryRefreshToken } from '../../../../../repositories/token/inMemory/InMemoryRefreshToken'
import { IUserRepository } from '../../../../../repositories/user/IUserRepository'
import { InMemoryUserRepository } from '../../../../../repositories/user/inMemory/InMemoryUserRepository'
import { LoginUserUseCase } from '../LoginUserUseCase'
import { createMockRbacRepository } from '../../../../../repositories/_mocks/RbacRepositoryMock'
import type { Mock } from 'vitest'

const stubFingerprint = 'stub-fingerprint-hash'
const clinicId = '00000000-0000-4000-8000-000000000001'
const mockPermissions = [
  { key: 'patients:read', scope: { type: 'all' as const } },
]

describe('Login user', () => {
  let userRepository: IUserRepository
  let loginUserUseCase: LoginUserUseCase
  let refreshToken: IRefreshTokenProvider
  let generateToken: IGenerateTokenProvider
  let rbacRepository: ReturnType<typeof createMockRbacRepository>
  let registerUserFingerprint: { execute: Mock }

  beforeAll(() => {
    userRepository = new InMemoryUserRepository()
    refreshToken = new InMemoryRefreshToken()
    generateToken = new InMemoryGenerateToken()
    rbacRepository = createMockRbacRepository()
    rbacRepository.findResolvedPermissionsByUser.mockResolvedValue(
      mockPermissions,
    )
    registerUserFingerprint = { execute: vi.fn().mockResolvedValue(undefined) }
    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      refreshToken,
      generateToken,
      rbacRepository,
      registerUserFingerprint as any,
    )
  })

  it('Should be able to login', async () => {
    const email = 'guilherme@gmail.com'
    const password = 'Senha123'
    const userData: UserDTO = {
      email,
      password,
      name: 'Guilherme Eduardo',
      phone: '(51) 99999 9999',
      clinicId,
      status: 'active',
    }

    const user = new User(userData)
    const userDTO = await user.getUserDTO()

    await userRepository.save(userDTO)
    const resolve = await loginUserUseCase.execute({
      email,
      password,
      fingerprintHash: stubFingerprint,
    })

    expect(resolve).toHaveProperty('token')
    expect(resolve).toHaveProperty('refreshToken')
    expect(registerUserFingerprint.execute).toHaveBeenCalledWith({
      userId: userDTO.id,
      fpHash: stubFingerprint,
    })
    expect(rbacRepository.findResolvedPermissionsByUser).toHaveBeenCalledWith({
      userId: userDTO.id,
      clinicId,
    })
    expect(resolve.token).toContain(`token-${userDTO.id}-${clinicId}-1`)
  })

  it('Should not be able to login if email is not corrected', async () => {
    const email = 'emailfake@gmail.com'
    const password = 'Senha123'
    await expect(
      loginUserUseCase.execute(email, password, stubFingerprint),
    ).rejects.toThrow('Email ou senha inválidos')
  })

  it('Should not be able to login if password is not corrected', async () => {
    const email = 'emailFake2@gmail.com'
    const wrongPassword = 'Senha1234'
    const userData: UserDTO = {
      email,
      password: 'Senha123',
      name: 'Guilherme Eduardo',
      phone: '(51) 99999 9999',
      clinicId,
      status: 'active',
    }

    const user = new User(userData)
    const userDTO = await user.getUserDTO()

    await userRepository.save(userDTO)
    await expect(
      loginUserUseCase.execute(email, wrongPassword, stubFingerprint),
    ).rejects.toThrow('Email ou senha inválidos')
  })
})

export {}
