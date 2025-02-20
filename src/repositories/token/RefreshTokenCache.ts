import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { redis } from "../../database/redis";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";

export class RefreshTokenCache implements IRefreshTokenProvider {
  constructor(private refreshTokenProvider: IRefreshTokenProvider) {}

  async generate(refreshToken: RefreshTokenDTO): Promise<void> {
    await redis.set(
      `refresh-token:${refreshToken.id}`,
      JSON.stringify(refreshToken),
    );
    return await this.refreshTokenProvider.generate(refreshToken);
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {
    const refreshTokenStringCached = await redis.get(`refresh-token:${id}`);
    if (refreshTokenStringCached) {
      return [JSON.parse(refreshTokenStringCached) as RefreshTokenDTO];
    }
    return await this.refreshTokenProvider.getRefreshToken(id);
  }

  async delete(id: string): Promise<void> {
    await redis.del(`refresh-token:${id}`);
    return await this.refreshTokenProvider.delete(id);
  }
}
