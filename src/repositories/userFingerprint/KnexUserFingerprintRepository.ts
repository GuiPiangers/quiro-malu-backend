import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IUserFingerprintRepository,
  MAX_FINGERPRINTS_PER_USER,
  type UserFingerprintUpsertProps,
} from "./IUserFingerprintRepository";

export class KnexUserFingerprintRepository implements IUserFingerprintRepository {
  async isKnown(props: UserFingerprintUpsertProps): Promise<boolean> {
    try {
      const row = await Knex(ETableNames.USER_FINGERPRINTS)
        .where({ userId: props.userId, fpHash: props.fpHash })
        .first("id");
      return row !== undefined;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }

  async upsertTouchLastUsed(props: UserFingerprintUpsertProps): Promise<void> {
    try {
      const now = Knex.fn.now();
      await Knex(ETableNames.USER_FINGERPRINTS)
        .insert({
          userId: props.userId,
          fpHash: props.fpHash,
          lastUsed: now,
          created_at: now,
          updated_at: now,
        })
        .onConflict(["userId", "fpHash"])
        .merge({
          lastUsed: now,
          updated_at: now,
        });
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }

  async registerNewFingerprint(props: UserFingerprintUpsertProps): Promise<void> {
    await this.upsertTouchLastUsed(props);
    await this.enforceLimit(props.userId);
  }

  private async enforceLimit(userId: string): Promise<void> {
    try {
      const [row] = await Knex(ETableNames.USER_FINGERPRINTS)
        .where({ userId })
        .count("id as total");
      const total = Number((row as { total?: number | string })?.total ?? 0);
      if (total <= MAX_FINGERPRINTS_PER_USER) {
        return;
      }
      const oldest = await Knex(ETableNames.USER_FINGERPRINTS)
        .where({ userId })
        .orderBy("lastUsed", "asc")
        .orderBy("id", "asc")
        .first("id");
      if (oldest?.id !== undefined) {
        await Knex(ETableNames.USER_FINGERPRINTS)
          .where({ id: oldest.id })
          .delete();
      }
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message, 500);
    }
  }
}
