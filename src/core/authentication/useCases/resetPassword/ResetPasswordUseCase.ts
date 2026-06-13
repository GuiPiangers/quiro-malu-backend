import { IPasswordResetTokenRepository } from '../../../../repositories/passwordResetToken/IPasswordResetTokenRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'
import { Crypto } from '../../../shared/helpers/Crypto'
import { User } from '../../models/User'

export type ResetPasswordInputDTO = {
  rawToken: string
  newPassword: string
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
  ) {}

  async execute({ rawToken, newPassword }: ResetPasswordInputDTO): Promise<void> {
    const tokenHash = Crypto.createFixedHash(rawToken)
    const record = await this.tokenRepository.findByHash(tokenHash)

    if (!record) throw new ApiError('Token inválido', 400)
    if (record.isInvalidated) throw new ApiError('Token inválido', 400)
    if (record.isUsed) throw new ApiError('Token já utilizado', 400)
    if (record.isExpired()) throw new ApiError('Token expirado', 400)

    const userDTO = await this.userRepository.findById(record.userId)
    if (!userDTO) throw new ApiError('Token inválido', 400)

    const user = new User(userDTO)
    const changedUser = user.changePassword(newPassword)
    const changedUserDTO = await changedUser.getUserDTO()

    await this.userRepository.updatePasswordAndStatus({
      userId: changedUser.id,
      passwordHash: changedUserDTO.password!,
      status: changedUser.status,
    })

    await this.tokenRepository.markAsUsed(record.id)
  }
}
