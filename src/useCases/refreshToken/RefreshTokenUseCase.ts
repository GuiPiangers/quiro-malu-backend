import dayjs from "dayjs";
import { IRefreshTokenProvider } from "../../provider/refreshToken/IRefreshTokenProvider";
import { IGenerateTokenProvider } from "../../provider/token/IGenerateTokenProvider";
import { RefreshToken } from "../../models/entities/RefreshToken";

export class RefreshTokenUseCase {
    constructor(
        private refreshTokenProvider: IRefreshTokenProvider,
        private generateTokenProvider: IGenerateTokenProvider
    ) { }

    async execute(refreshTokenId: string) {
        const [refreshToken] = await this.refreshTokenProvider.getRefreshToken(refreshTokenId)
        if (!refreshToken) throw new Error('Refresh Token inválido')

        const token = await this.generateTokenProvider.execute(refreshToken.userId)
        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))

        if (refreshTokenExpired) {
            const { id: _, ...refreshTokenData } = { ...refreshToken }
            const { id, expiresIn, userId } = new RefreshToken(refreshTokenData)
            const newRefreshToken = await this.refreshTokenProvider.generate({
                id: id.value,
                expiresIn,
                userId
            })
            return { token, newRefreshToken }
        }

        return { token }
    }
}