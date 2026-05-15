import type { Knex } from "knex";
import dayjs from "dayjs";
import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { db } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";

const MAX_SESSIONS = 5;

function mapLastUsedAt(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) {
    return value.toISOString().substring(0, 16);
  }
  const s = String(value);
  return s.length >= 16 ? s.substring(0, 16) : s;
}

function rowToDTO(row: Record<string, unknown>): RefreshTokenDTO {
  return {
    id: String(row.id),
    userId: String(row.userId),
    clinicId: String(row.clinicId),
    fingerprint: String(row.fingerprint),
    expiresIn: Number(row.expiresIn),
    lastUsedAt: mapLastUsedAt(row.lastUsedAt),
  };
}

export class RefreshTokenProvider implements IRefreshTokenProvider {
  constructor(private readonly knex: Knex) {}

  async delete(id: string): Promise<void> {
    await this.knex(ETableNames.REFRESH_TOKEN).where({ id }).del();
  }

  async generate(refreshToken: RefreshTokenDTO): Promise<void> {
    await this.knex(ETableNames.REFRESH_TOKEN)
      .where({
        userId: refreshToken.userId,
        fingerprint: refreshToken.fingerprint,
      })
      .del();

    const sessions = await this.knex(ETableNames.REFRESH_TOKEN)
      .where({ userId: refreshToken.userId })
      .orderByRaw("COALESCE(lastUsedAt, created_at) ASC");

    if (sessions.length >= MAX_SESSIONS) {
      await this.knex(ETableNames.REFRESH_TOKEN)
        .where({ id: sessions[0].id })
        .del();
    }

    await this.knex(ETableNames.REFRESH_TOKEN).insert({
      id: refreshToken.id!,
      userId: refreshToken.userId,
      clinicId: refreshToken.clinicId,
      fingerprint: refreshToken.fingerprint,
      expiresIn: refreshToken.expiresIn,
    });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO | null> {
    const row = await this.knex(ETableNames.REFRESH_TOKEN)
      .select("*")
      .where({ id })
      .first();
    if (!row) return null;
    return rowToDTO(row as Record<string, unknown>);
  }

  async markAsUsed(id: string): Promise<void> {
    await this.knex(ETableNames.REFRESH_TOKEN)
      .where({ id })
      .update({ lastUsedAt: this.knex.fn.now() });
  }

  async deleteByFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<void> {
    await this.knex(ETableNames.REFRESH_TOKEN)
      .where({ userId, fingerprint })
      .del();
  }

  async deleteAllFromUser(userId: string): Promise<void> {
    await this.knex(ETableNames.REFRESH_TOKEN).where({ userId }).del();
  }

  async deleteExpired(): Promise<void> {
    const nowUnix = dayjs().unix();
    await this.knex(ETableNames.REFRESH_TOKEN)
      .where("expiresIn", "<", nowUnix)
      .del();
  }
}

export const refreshTokenProvider = new RefreshTokenProvider(db);
