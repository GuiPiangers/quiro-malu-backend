import { DateTime } from '../../../shared/Date'
import { PasswordResetToken } from '../PasswordResetToken'

describe('PasswordResetToken', () => {
  it('should create a token and return its DTO', () => {
    const token = new PasswordResetToken({
      id: 'token-id',
      userId: 'user-id',
      tokenHash: 'hash',
      expiresAt: '2026-06-13T10:30',
    })

    expect(token.getDTO()).toEqual({
      id: 'token-id',
      userId: 'user-id',
      tokenHash: 'hash',
      expiresAt: '2026-06-13T10:30',
      usedAt: null,
      invalidatedAt: null,
    })
  })

  it('should mark token as used returning a new instance', () => {
    const token = new PasswordResetToken({
      userId: 'user-id',
      tokenHash: 'hash',
      expiresAt: '2026-06-13T10:30',
    })

    const usedToken = token.markAsUsed(new DateTime('2026-06-13T10:00'))

    expect(token.usedAt).toBeNull()
    expect(usedToken.usedAt?.dateTime).toBe('2026-06-13T10:00')
    expect(usedToken.isUsed).toBe(true)
  })

  it('should invalidate token returning a new instance', () => {
    const token = new PasswordResetToken({
      userId: 'user-id',
      tokenHash: 'hash',
      expiresAt: '2026-06-13T10:30',
    })

    const invalidatedToken = token.invalidate(
      new DateTime('2026-06-13T10:00'),
    )

    expect(token.invalidatedAt).toBeNull()
    expect(invalidatedToken.invalidatedAt?.dateTime).toBe('2026-06-13T10:00')
    expect(invalidatedToken.isInvalidated).toBe(true)
  })

  it('should identify expired tokens', () => {
    const token = new PasswordResetToken({
      userId: 'user-id',
      tokenHash: 'hash',
      expiresAt: '2026-06-13T10:30',
    })

    expect(token.isExpired(new DateTime('2026-06-13T10:31'))).toBe(true)
    expect(token.isExpired(new DateTime('2026-06-13T10:29'))).toBe(false)
  })
})
