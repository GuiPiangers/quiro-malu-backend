import type { Knex } from 'knex'
import { PasswordResetToken } from '../../core/authentication/models/PasswordResetToken'
import { DateTime } from '../../core/shared/Date'
import { ETableNames } from '../../database/ETableNames'
import { IPasswordResetTokenRepository } from './IPasswordResetTokenRepository'

type PasswordResetTokenRow = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: string
  usedAt: string | null
  invalidatedAt: string | null
}

export class KnexPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly knex: Knex) {}

  async create(token: PasswordResetToken): Promise<void> {
    const dto = token.getDTO()

    await this.knex(ETableNames.PASSWORD_RESET_TOKENS).insert({
      id: dto.id,
      userId: dto.userId,
      tokenHash: dto.tokenHash,
      expiresAt: dto.expiresAt,
      usedAt: dto.usedAt,
      invalidatedAt: dto.invalidatedAt,
    })
  }

  async findByHash(tokenHash: string): Promise<PasswordResetToken | null> {
    const row: PasswordResetTokenRow | undefined = await this.knex(
      ETableNames.PASSWORD_RESET_TOKENS,
    )
      .select(
        'id',
        'userId',
        'tokenHash',
        this.knex.raw('DATE_FORMAT(expiresAt, \'%Y-%m-%dT%H:%i\') as expiresAt'),
        this.knex.raw('DATE_FORMAT(usedAt, \'%Y-%m-%dT%H:%i\') as usedAt'),
        this.knex.raw(
          'DATE_FORMAT(invalidatedAt, \'%Y-%m-%dT%H:%i\') as invalidatedAt',
        ),
      )
      .where({ tokenHash })
      .first()

    if (!row) return null

    return new PasswordResetToken(row)
  }

  async invalidatePreviousByUserId(
    userId: string,
    invalidatedAt = DateTime.now(),
  ): Promise<void> {
    await this.knex(ETableNames.PASSWORD_RESET_TOKENS)
      .where({ userId })
      .whereNull('usedAt')
      .whereNull('invalidatedAt')
      .update({ invalidatedAt: invalidatedAt.dateTime })
  }

  async markAsUsed(id: string, usedAt = DateTime.now()): Promise<void> {
    await this.knex(ETableNames.PASSWORD_RESET_TOKENS)
      .where({ id })
      .update({ usedAt: usedAt.dateTime })
  }
}
