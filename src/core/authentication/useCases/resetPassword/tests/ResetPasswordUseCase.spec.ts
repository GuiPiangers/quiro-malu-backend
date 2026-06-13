import { PasswordResetToken } from '../../../models/PasswordResetToken'
import { Crypto } from '../../../../shared/helpers/Crypto'
import { InMemoryPasswordResetTokenRepository } from '../../../../../repositories/passwordResetToken/inMemory/InMemoryPasswordResetTokenRepository'
import { InMemoryUserRepository } from '../../../../../repositories/user/inMemory/InMemoryUserRepository'
import { ResetPasswordUseCase } from '../ResetPasswordUseCase'

describe('ResetPasswordUseCase', () => {
  let userRepository: InMemoryUserRepository
  let tokenRepository: InMemoryPasswordResetTokenRepository
  let useCase: ResetPasswordUseCase

  const rawToken = 'raw-token'
  const tokenHash = Crypto.createFixedHash(rawToken)

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-13T13:00:00.000Z'))

    userRepository = new InMemoryUserRepository()
    tokenRepository = new InMemoryPasswordResetTokenRepository()
    useCase = new ResetPasswordUseCase(userRepository, tokenRepository)

    await userRepository.save({
      id: 'user-id',
      email: 'user@test.com',
      name: 'User Test',
      phone: '(51) 99999 9999',
      password: null,
      clinicId: 'clinic-id',
      status: 'pending',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should reset password, activate pending user and mark token as used', async () => {
    await tokenRepository.create(
      new PasswordResetToken({
        userId: 'user-id',
        tokenHash,
        expiresAt: '2026-06-13T10:30',
      }),
    )

    await useCase.execute({
      rawToken,
      newPassword: 'NovaSenha1',
    })

    const user = await userRepository.findById('user-id')
    const token = await tokenRepository.findByHash(tokenHash)

    expect(user?.status).toBe('active')
    expect(user?.password).toEqual(expect.any(String))
    expect(user?.password).not.toBe('NovaSenha1')
    expect(
      await Crypto.compareRandomHash('NovaSenha1', user?.password ?? ''),
    ).toBe(true)
    expect(token?.usedAt?.dateTime).toBe('2026-06-13T10:00')
  })

  it('should reject invalid token', async () => {
    await expect(
      useCase.execute({
        rawToken: 'invalid-token',
        newPassword: 'NovaSenha1',
      }),
    ).rejects.toThrow('Token inválido')
  })

  it('should reject invalidated token', async () => {
    await tokenRepository.create(
      new PasswordResetToken({
        userId: 'user-id',
        tokenHash,
        expiresAt: '2026-06-13T10:30',
        invalidatedAt: '2026-06-13T10:00',
      }),
    )

    await expect(
      useCase.execute({
        rawToken,
        newPassword: 'NovaSenha1',
      }),
    ).rejects.toThrow('Token inválido')
  })

  it('should reject used token', async () => {
    await tokenRepository.create(
      new PasswordResetToken({
        userId: 'user-id',
        tokenHash,
        expiresAt: '2026-06-13T10:30',
        usedAt: '2026-06-13T10:00',
      }),
    )

    await expect(
      useCase.execute({
        rawToken,
        newPassword: 'NovaSenha1',
      }),
    ).rejects.toThrow('Token já utilizado')
  })

  it('should reject expired token', async () => {
    await tokenRepository.create(
      new PasswordResetToken({
        userId: 'user-id',
        tokenHash,
        expiresAt: '2026-06-13T09:59',
      }),
    )

    await expect(
      useCase.execute({
        rawToken,
        newPassword: 'NovaSenha1',
      }),
    ).rejects.toThrow('Token expirado')
  })

  it('should reject password change for inactive user', async () => {
    await userRepository.updatePasswordAndStatus({
      userId: 'user-id',
      passwordHash: '',
      status: 'inactive',
    })
    await tokenRepository.create(
      new PasswordResetToken({
        userId: 'user-id',
        tokenHash,
        expiresAt: '2026-06-13T10:30',
      }),
    )

    await expect(
      useCase.execute({
        rawToken,
        newPassword: 'NovaSenha1',
      }),
    ).rejects.toThrow('Conta desativada. Entre em contato com o suporte.')
  })
})
