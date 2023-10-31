import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";

export interface IRefreshTokenProvider {
    generate(refreshToken: RefreshTokenDTO): Promise<void>
    getRefreshToken(id: string): Promise<RefreshTokenDTO[]>
    delete(id: string): Promise<void>
}