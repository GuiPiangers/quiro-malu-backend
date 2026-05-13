import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";

export interface IRefreshTokenProvider {
  generate(refreshToken: RefreshTokenDTO): Promise<void>;
  getRefreshToken(id: string): Promise<RefreshTokenDTO | null>;
  markAsUsed(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByFingerprint(userId: string, fingerprint: string): Promise<void>;
  deleteAllFromUser(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
