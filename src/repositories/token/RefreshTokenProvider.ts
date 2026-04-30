import type { Knex } from "knex";
import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { db } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";

export class RefreshTokenProvider implements IRefreshTokenProvider {
  constructor(private readonly knex: Knex) {}

  private async deleteWithUserId(userId: string) {
    await this.knex(ETableNames.REFRESH_TOKEN).where({ userId }).del();
  }

  async delete(id: string) {
    await this.knex(ETableNames.REFRESH_TOKEN).where({ id }).del();
  }

  async generate(RefreshToken: RefreshTokenDTO): Promise<void> {
    await this.deleteWithUserId(RefreshToken.userId);
    return await this.knex(ETableNames.REFRESH_TOKEN).insert(RefreshToken);
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {
    return await this.knex(ETableNames.REFRESH_TOKEN).select("*").where({ id });
  }
}

export const refreshTokenProvider = new RefreshTokenProvider(db);
