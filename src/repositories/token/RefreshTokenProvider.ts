import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";

class RefreshTokenProvider implements IRefreshTokenProvider {
  private async deleteWithUserId(userId: string) {
    await Knex(ETableNames.REFRESH_TOKEN).where({ userId }).del();
  }

  async delete(id: string) {
    await Knex(ETableNames.REFRESH_TOKEN).where({ id }).del();
  }

  async generate(RefreshToken: RefreshTokenDTO): Promise<void> {
    await this.deleteWithUserId(RefreshToken.userId);
    return await Knex(ETableNames.REFRESH_TOKEN).insert(RefreshToken);
  }

  async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {
    return await Knex(ETableNames.REFRESH_TOKEN).select("*").where({ id });
  }
}

const refreshTokenProvider = new RefreshTokenProvider();

export { refreshTokenProvider };
