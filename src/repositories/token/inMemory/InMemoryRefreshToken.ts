import { RefreshTokenDTO } from '../../../core/authentication/models/RefreshToken';
import { IRefreshTokenProvider } from '../IRefreshTokenProvider'

export class InMemoryRefreshToken implements IRefreshTokenProvider {
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    private refreshTokens: RefreshTokenDTO[] = []

    async generate(refreshToken: RefreshTokenDTO): Promise<void> {
        this.refreshTokens.push(refreshToken)
    }

    async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {
        const refToken = this.refreshTokens.find(refreshToken => refreshToken.id === id)

        if (refToken) return [refToken]
        return []
    }

}