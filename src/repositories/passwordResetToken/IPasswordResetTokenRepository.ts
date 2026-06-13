import { DateTime } from '../../core/shared/Date'
import { PasswordResetToken } from '../../core/authentication/models/PasswordResetToken'

export interface IPasswordResetTokenRepository {
  create(token: PasswordResetToken): Promise<void>
  findByHash(tokenHash: string): Promise<PasswordResetToken | null>
  invalidatePreviousByUserId(
    userId: string,
    invalidatedAt?: DateTime,
  ): Promise<void>
  markAsUsed(id: string, usedAt?: DateTime): Promise<void>
}
