import dayjs from "dayjs";
import { RefreshTokenDTO } from "../../../core/authentication/models/RefreshToken";
import { IRefreshTokenProvider } from "../IRefreshTokenProvider";

const MAX_SESSIONS = 5;

export class InMemoryRefreshToken implements IRefreshTokenProvider {
  private refreshTokens: RefreshTokenDTO[] = [];

  async delete(id: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter((t) => t.id !== id);
  }

  async generate(refreshToken: RefreshTokenDTO): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(
      (t) =>
        !(
          t.userId === refreshToken.userId &&
          t.fingerprint === refreshToken.fingerprint
        ),
    );

    let userSessions = this.refreshTokens.filter(
      (t) => t.userId === refreshToken.userId,
    );
    userSessions.sort((a, b) => {
      const ta = a.lastUsedAt ? dayjs(a.lastUsedAt).valueOf() : 0;
      const tb = b.lastUsedAt ? dayjs(b.lastUsedAt).valueOf() : 0;
      return ta - tb;
    });

    if (userSessions.length >= MAX_SESSIONS) {
      const oldest = userSessions[0];
      this.refreshTokens = this.refreshTokens.filter((t) => t.id !== oldest.id);
    }

    this.refreshTokens.push({ ...refreshToken });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO | null> {
    const refToken = this.refreshTokens.find((t) => t.id === id);
    return refToken ? { ...refToken } : null;
  }

  async markAsUsed(id: string): Promise<void> {
    const t = this.refreshTokens.find((r) => r.id === id);
    if (t) {
      t.lastUsedAt = dayjs().format("YYYY-MM-DDTHH:mm");
    }
  }

  async deleteByFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(
      (t) => !(t.userId === userId && t.fingerprint === fingerprint),
    );
  }

  async deleteAllFromUser(userId: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter((t) => t.userId !== userId);
  }

  async deleteExpired(): Promise<void> {
    const now = dayjs().unix();
    this.refreshTokens = this.refreshTokens.filter((t) => t.expiresIn >= now);
  }
}
