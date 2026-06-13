import { PasswordResetToken } from '../../../core/authentication/models/PasswordResetToken'
import { DateTime } from '../../../core/shared/Date'
import { IPasswordResetTokenRepository } from '../IPasswordResetTokenRepository'

export class InMemoryPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private dbTokens: PasswordResetToken[] = []

  async create(token: PasswordResetToken): Promise<void> {
    this.dbTokens.push(token)
  }

  async findByHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.dbTokens.find((token) => token.tokenHash === tokenHash) ?? null
  }

  async invalidatePreviousByUserId(
    userId: string,
    invalidatedAt = DateTime.now(),
  ): Promise<void> {
    this.dbTokens = this.dbTokens.map((token) => {
      if (token.userId !== userId || token.isUsed || token.isInvalidated) {
        return token
      }

      return token.invalidate(invalidatedAt)
    })
  }

  async markAsUsed(id: string, usedAt = DateTime.now()): Promise<void> {
    this.dbTokens = this.dbTokens.map((token) => {
      if (token.id !== id) return token
      return token.markAsUsed(usedAt)
    })
  }
}
