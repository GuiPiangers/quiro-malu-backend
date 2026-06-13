import { Crypto } from '../../../../shared/helpers/Crypto'
import { PasswordResetToken } from '../../../models/PasswordResetToken'
import { InMemoryPasswordResetTokenRepository } from '../../../../../repositories/passwordResetToken/inMemory/InMemoryPasswordResetTokenRepository'
import { InMemoryUserRepository } from '../../../../../repositories/user/inMemory/InMemoryUserRepository'
import { CreateChangePasswordTokenUseCase } from '../CreateChangePasswordTokenUseCase'

describe('CreateChangePasswordTokenUseCase', () => {
  let userRepository: InMemoryUserRepository
  let tokenRepository: InMemoryPasswordResetTokenRepository
  let useCase: CreateChangePasswordTokenUseCase

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-13T13:00:00.000Z'))

    userRepository = new InMemoryUserRepository()
    tokenRepository = new InMemoryPasswordResetTokenRepository()
    useCase = new CreateChangePasswordTokenUseCase(
      userRepository,
      tokenRepository,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a hashed token for an existing user', async () => {
    await userRepository.save({
      id: 'user-id',
      email: 'user@test.com',
      name: 'User Test',
      phone: '(51) 99999 9999',
      password: null,
      clinicId: 'clinic-id',
      status: 'pending',
    })

    const rawToken = await useCase.execute('user@test.com')

    expect(rawToken).toEqual(expect.any(String))
    const tokenHash = Crypto.createFixedHash(rawToken!)
    const record = await tokenRepository.findByHash(tokenHash)

    expect(record).not.toBeNull()
    expect(record?.tokenHash).toBe(tokenHash)
    expect(record?.tokenHash).not.toBe(rawToken)
    expect(record?.expiresAt.dateTime).toBe('2026-06-13T10:30')
  })

  it('should return null when email does not exist', async () => {
    const rawToken = await useCase.execute('missing@test.com')

    expect(rawToken).toBeNull()
  })

  it('should invalidate previous active tokens from the same user', async () => {
    await userRepository.save({
      id: 'user-id',
      email: 'user@test.com',
      name: 'User Test',
      phone: '(51) 99999 9999',
      password: null,
      clinicId: 'clinic-id',
      status: 'pending',
    })

    const previousToken = new PasswordResetToken({
      userId: 'user-id',
      tokenHash: 'previous-token-hash',
      expiresAt: '2026-06-13T10:30',
    })
    await tokenRepository.create(previousToken)

    await useCase.execute('user@test.com')

    const previousRecord = await tokenRepository.findByHash(
      'previous-token-hash',
    )
    expect(previousRecord?.invalidatedAt?.dateTime).toBe('2026-06-13T10:00')
  })

  it('should use custom ttl when provided', async () => {
    await userRepository.save({
      id: 'user-id',
      email: 'user@test.com',
      name: 'User Test',
      phone: '(51) 99999 9999',
      password: null,
      clinicId: 'clinic-id',
      status: 'pending',
    })

    const rawToken = await useCase.execute('user@test.com', 10)
    const record = await tokenRepository.findByHash(
      Crypto.createFixedHash(rawToken!),
    )

    expect(record?.expiresAt.dateTime).toBe('2026-06-13T10:10')
  })
})
