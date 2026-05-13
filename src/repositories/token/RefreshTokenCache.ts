import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { redis } from "../../database/redis";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";

export class RefreshTokenCache implements IRefreshTokenProvider {
  constructor(private refreshTokenProvider: IRefreshTokenProvider) {}

  async generate(refreshToken: RefreshTokenDTO): Promise<void> {
    await redis.set(
      `refresh-token:${refreshToken.id}`,
      JSON.stringify(refreshToken),
      "EX",
      60 * 60 * 24, // 1 dia
    );
    return await this.refreshTokenProvider.generate(refreshToken);
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO | null> {
    const refreshTokenStringCached = await redis.get(`refresh-token:${id}`);
    if (refreshTokenStringCached) {
      return JSON.parse(refreshTokenStringCached) as RefreshTokenDTO;
    }
    return await this.refreshTokenProvider.getRefreshToken(id);
  }

  async markAsUsed(id: string): Promise<void> {
    await this.refreshTokenProvider.markAsUsed(id);
    await redis.del(`refresh-token:${id}`);
  }

  async delete(id: string): Promise<void> {
    await redis.del(`refresh-token:${id}`);
    return await this.refreshTokenProvider.delete(id);
  }

  async deleteByFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<void> {
    return await this.refreshTokenProvider.deleteByFingerprint(
      userId,
      fingerprint,
    );
  }

  async deleteAllFromUser(userId: string): Promise<void> {
    return await this.refreshTokenProvider.deleteAllFromUser(userId);
  }

  async deleteExpired(): Promise<void> {
    return await this.refreshTokenProvider.deleteExpired();
  }
}
