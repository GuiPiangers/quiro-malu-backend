import dayjs from 'dayjs'
import { IRefreshTokenProvider } from '../../../../repositories/token/IRefreshTokenProvider'
import { IGenerateTokenProvider } from '../../../../repositories/token/IGenerateTokenProvider'
import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import { RefreshToken } from '../../models/RefreshToken'
import { ApiError } from '../../../../utils/ApiError'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenProvider: IRefreshTokenProvider,
    private generateTokenProvider: IGenerateTokenProvider,
    private userRepository: IUserRepository,
    private rbacRepository: IRbacRepository,
  ) {}

  async execute(refreshTokenId: string, fingerprint: string) {
    const refreshToken =
      await this.refreshTokenProvider.getRefreshToken(refreshTokenId)
    if (!refreshToken) throw new ApiError('Refresh Token inválido', 401)

    if (refreshToken.fingerprint !== fingerprint) {
      throw new ApiError('Refresh Token inválido para este dispositivo', 401)
    }

    const tokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))

    if (tokenExpired) {
      await this.refreshTokenProvider.deleteByFingerprint(
        refreshToken.userId,
        refreshToken.fingerprint,
      )
      throw new ApiError('Sessão expirada, faça login novamente', 401)
    }

    if (!refreshToken.clinicId?.trim()) {
      throw new ApiError('Sessão expirada, faça login novamente', 401)
    }

    await this.refreshTokenProvider.markAsUsed(refreshTokenId)

    const user = await this.userRepository.getById({
      userId: refreshToken.userId,
      clinicId: refreshToken.clinicId,
    })
    if (!user?.clinicId) throw new ApiError('Usuário não encontrado', 401)

    const permissions = await this.rbacRepository.findResolvedPermissionsByUser(
      {
        userId: refreshToken.userId,
        clinicId: user.clinicId,
      },
    )

    const token = await this.generateTokenProvider.execute({
      userId: refreshToken.userId,
      clinicId: user.clinicId,
      permissions,
    })

    const newExpiresIn = dayjs().add(15, 'days').unix()
    const newRefreshToken = new RefreshToken({
      userId: refreshToken.userId,
      clinicId: refreshToken.clinicId,
      fingerprint: refreshToken.fingerprint,
      expiresIn: newExpiresIn,
    })

    await this.refreshTokenProvider.generate(newRefreshToken.getDTO())
    await this.refreshTokenProvider.delete(refreshTokenId)

    return { token, refreshToken: newRefreshToken.id }
  }
}
