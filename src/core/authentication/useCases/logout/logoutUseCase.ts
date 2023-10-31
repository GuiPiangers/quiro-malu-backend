import { IRefreshTokenProvider } from "../../../../repositories/token/IRefreshTokenProvider";


export class LogoutUseCase {
    constructor(
        private refreshTokenProvider: IRefreshTokenProvider,
    ) { }

    async execute(refreshTokenId: string) {
        await this.refreshTokenProvider.delete(refreshTokenId)

    }
}