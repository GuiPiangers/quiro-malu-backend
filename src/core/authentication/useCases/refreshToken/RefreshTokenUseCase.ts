import dayjs from "dayjs";
import { IRefreshTokenProvider } from "../../../../repositories/token/IRefreshTokenProvider";
import { IGenerateTokenProvider } from "../../../../repositories/token/IGenerateTokenProvider";
import { RefreshToken } from "../../models/RefreshToken";

export class RefreshTokenUseCase {
    constructor(
        private refreshTokenProvider: IRefreshTokenProvider,
        private generateTokenProvider: IGenerateTokenProvider
    ) { }

    async execute(refreshTokenId: string, userId: string) {
        const [refreshToken] = await this.refreshTokenProvider.getRefreshToken(refreshTokenId)
        if (!refreshToken) throw new Error('Refresh Token inválido')
        if (refreshToken.userId !== userId) throw new Error('Falha de autenticação')
        const token = await this.generateTokenProvider.execute(refreshToken.userId)
        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))

        if (refreshTokenExpired) {
            const { id: _, ...refreshTokenData } = refreshToken
            const { id, expiresIn, userId } = new RefreshToken(refreshTokenData)
            const newRefreshToken = await this.refreshTokenProvider.generate({
                id: id,
                expiresIn,
                userId
            })
            return { token, newRefreshToken }
        }

        return { token }
    }
}