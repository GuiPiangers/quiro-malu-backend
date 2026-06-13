import { DateTime } from '../../shared/Date'
import { Entity } from '../../shared/Entity'

export interface PasswordResetTokenDTO {
  id?: string
  userId: string
  tokenHash: string
  expiresAt: string | DateTime
  usedAt?: string | DateTime | null
  invalidatedAt?: string | DateTime | null
}

function toDateTime(value: string | DateTime | null | undefined) {
  if (!value) return null
  if (value instanceof DateTime) return value
  return new DateTime(value)
}

export class PasswordResetToken extends Entity {
  readonly userId: string
  readonly tokenHash: string
  readonly expiresAt: DateTime
  readonly usedAt: DateTime | null
  readonly invalidatedAt: DateTime | null

  constructor(props: PasswordResetTokenDTO) {
    super(props.id)
    this.userId = props.userId
    this.tokenHash = props.tokenHash
    this.expiresAt = toDateTime(props.expiresAt)!
    this.usedAt = toDateTime(props.usedAt)
    this.invalidatedAt = toDateTime(props.invalidatedAt)
  }

  get isUsed() {
    return Boolean(this.usedAt)
  }

  get isInvalidated() {
    return Boolean(this.invalidatedAt)
  }

  isExpired(now = DateTime.now()) {
    return DateTime.difference(this.expiresAt, now) < 0
  }

  markAsUsed(usedAt = DateTime.now()) {
    return new PasswordResetToken({
      ...this.getDTO(),
      usedAt,
    })
  }

  invalidate(invalidatedAt = DateTime.now()) {
    return new PasswordResetToken({
      ...this.getDTO(),
      invalidatedAt,
    })
  }

  getDTO(): Required<PasswordResetTokenDTO> {
    return {
      id: this.id,
      userId: this.userId,
      tokenHash: this.tokenHash,
      expiresAt: this.expiresAt.dateTime,
      usedAt: this.usedAt?.dateTime ?? null,
      invalidatedAt: this.invalidatedAt?.dateTime ?? null,
    }
  }
}
