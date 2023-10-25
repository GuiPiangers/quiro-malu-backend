import { RefreshTokenDTO } from "../../models/entities/RefreshToken";

export interface IRefreshTokenProvider {
    generate(refreshToken: RefreshTokenDTO): Promise<void>
    getRefreshToken(id: string): Promise<RefreshTokenDTO[]>
}