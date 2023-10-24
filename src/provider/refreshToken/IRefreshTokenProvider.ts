import { RefreshTokenDTO } from "../../models/entities/RefreshToken";

export interface IRefreshTokenProvider {
    generate(RefreshToken: RefreshTokenDTO): Promise<void>
    getRefreshToken(id: string): Promise<RefreshTokenDTO[]>
}