import { IRefreshTokenProvider } from '../../../../repositories/token/IRefreshTokenProvider'
import { ApiError } from '../../../../utils/ApiError'

export class LogoutUseCase {
  constructor(private refreshTokenProvider: IRefreshTokenProvider) {}

  async execute(refreshTokenId: string, fingerprint: string): Promise<void> {
    const token = await this.refreshTokenProvider.getRefreshToken(refreshTokenId)

    if (!token) throw new ApiError('Sessão não encontrada', 404)

    if (token.fingerprint !== fingerprint) {
      throw new ApiError('Não autorizado', 401)
    }

    await this.refreshTokenProvider.delete(refreshTokenId)
  }

  async executeGlobal(userId: string): Promise<void> {
    await this.refreshTokenProvider.deleteAllFromUser(userId)
  }
}
