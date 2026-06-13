import { IPasswordResetTokenRepository } from '../../../../repositories/passwordResetToken/IPasswordResetTokenRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { PasswordResetToken } from '../../models/PasswordResetToken'
import { DateTime } from '../../../shared/Date'
import { Id } from '../../../shared/Id'
import { Crypto } from '../../../shared/helpers/Crypto'

export class CreateChangePasswordTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
  ) {}

  async execute(email: string, ttlMinutes = 30): Promise<string | null> {
    const [user] = await this.userRepository.getByEmail(email)

    if (!user?.id) return null

    await this.tokenRepository.invalidatePreviousByUserId(user.id)

    const rawToken = new Id().value
    const tokenHash = Crypto.createFixedHash(rawToken)
    const expiresAt = DateTime.now().setMinutes(ttlMinutes)!

    const token = new PasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    })

    await this.tokenRepository.create(token)

    return rawToken
  }
}
